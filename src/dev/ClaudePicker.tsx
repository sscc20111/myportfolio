// Dev-only: drag over part of the page, describe the change, and it lands in
// .claude/inbox/ for the Claude Code "browser-pick" mod to send to Claude.
// Toggle with Alt+Shift+C or the floating button. Never included in a build.
import { useEffect, useRef, useState } from 'react'

type Rect = { x: number; y: number; width: number; height: number }
type Picked = { el: Element; rect: DOMRect }

export const ROOT_ID = 'claude-picker-root'
const MAX_ELEMENTS = 8

const describe = (el: Element) => {
  const tag = el.tagName.toLowerCase()
  if (el.id) return `${tag}#${CSS.escape(el.id)}`
  const classes = [...el.classList].slice(0, 2).map(c => `.${CSS.escape(c)}`).join('')
  return tag + classes
}

const selectorOf = (el: Element) => {
  const parts: string[] = []
  for (let cur: Element | null = el; cur && cur !== document.body && parts.length < 4; cur = cur.parentElement) {
    parts.unshift(describe(cur))
    if (cur.id) break
  }
  return parts.join(' > ')
}

const isVisible = (r: DOMRect) => r.width > 0 && r.height > 0

const pickElements = (area: Rect): Picked[] => {
  const root = document.getElementById(ROOT_ID)
  const isClick = area.width < 5 && area.height < 5

  if (isClick) {
    const el = document
      .elementsFromPoint(area.x, area.y)
      .find(e => !root?.contains(e) && e !== document.documentElement && e !== document.body)
    return el ? [{ el, rect: el.getBoundingClientRect() }] : []
  }

  const inside: Picked[] = []
  for (const el of document.body.querySelectorAll('*')) {
    if (root?.contains(el)) continue
    const r = el.getBoundingClientRect()
    if (!isVisible(r)) continue
    const isInside =
      r.left >= area.x && r.top >= area.y &&
      r.right <= area.x + area.width && r.bottom <= area.y + area.height
    if (isInside) inside.push({ el, rect: r })
  }
  // Keep the outermost ones: a child of something already picked adds nothing.
  const outer = inside.filter(p => !inside.some(o => o.el !== p.el && o.el.contains(p.el)))
  if (outer.length > 0) return outer.slice(0, MAX_ELEMENTS)

  // Nothing fully inside: fall back to what sits under the area's centre.
  return pickElements({ x: area.x + area.width / 2, y: area.y + area.height / 2, width: 0, height: 0 })
}

const normalize = (a: { x: number; y: number }, b: { x: number; y: number }): Rect => ({
  x: Math.min(a.x, b.x),
  y: Math.min(a.y, b.y),
  width: Math.abs(a.x - b.x),
  height: Math.abs(a.y - b.y),
})

export default function ClaudePicker() {
  const [isActive, setIsActive] = useState(false)
  const [drag, setDrag] = useState<Rect | null>(null)
  const [picked, setPicked] = useState<Picked[]>([])
  const [area, setArea] = useState<Rect | null>(null)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const start = useRef<{ x: number; y: number } | null>(null)

  const reset = () => {
    setDrag(null)
    setPicked([])
    setArea(null)
    setNote('')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.code === 'KeyC') {
        e.preventDefault()
        setIsActive(v => !v)
        reset()
      } else if (e.key === 'Escape') {
        setIsActive(false)
        reset()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const send = async () => {
    if (!area || picked.length === 0 || !note.trim()) return
    const body = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      url: location.href,
      note: note.trim(),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      rect: { x: Math.round(area.x), y: Math.round(area.y + window.scrollY), width: Math.round(area.width), height: Math.round(area.height) },
      elements: picked.map(({ el }) => ({
        selector: selectorOf(el),
        tag: el.tagName.toLowerCase(),
        classes: el.getAttribute('class')?.slice(0, 200) || undefined,
        text: (el as HTMLElement).innerText?.replace(/\s+/g, ' ').trim().slice(0, 80) || undefined,
      })),
    }
    try {
      const res = await fetch('/__claude/pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setStatus(res.ok ? 'Claude에게 보냈어요 ✓' : `실패: ${res.status}`)
    } catch (err) {
      setStatus(`실패: ${String(err)}`)
    }
    reset()
    setIsActive(false)
    setTimeout(() => setStatus(null), 2500)
  }

  const isPicked = picked.length > 0 && area !== null
  const formTop = area ? Math.min(area.y + area.height + 8, window.innerHeight - 150) : 0
  const formLeft = area ? Math.min(area.x, window.innerWidth - 336) : 0

  return (
    <>
      <button
        type="button"
        onClick={() => { setIsActive(v => !v); reset() }}
        title="Claude에게 수정 요청 (Alt+Shift+C)"
        style={{
          position: 'fixed', left: 16, bottom: 16, zIndex: 2147483646,
          width: 40, height: 40, borderRadius: 20, border: 'none', cursor: 'pointer',
          background: isActive ? '#d97757' : '#333', color: '#fff', fontSize: 18,
          boxShadow: '0 2px 8px rgba(0,0,0,.3)',
        }}
      >
        ✎
      </button>

      {status && (
        <div style={{
          position: 'fixed', left: 64, bottom: 22, zIndex: 2147483646, padding: '6px 10px',
          background: '#333', color: '#fff', borderRadius: 6, font: '13px sans-serif',
        }}>
          {status}
        </div>
      )}

      {isActive && !isPicked && (
        <div
          onMouseDown={e => {
            start.current = { x: e.clientX, y: e.clientY }
            setDrag({ x: e.clientX, y: e.clientY, width: 0, height: 0 })
          }}
          onMouseMove={e => {
            if (start.current) setDrag(normalize(start.current, { x: e.clientX, y: e.clientY }))
          }}
          onMouseUp={e => {
            if (!start.current) return
            const rect = normalize(start.current, { x: e.clientX, y: e.clientY })
            start.current = null
            setDrag(null)
            const found = pickElements(rect)
            if (found.length === 0) return
            setPicked(found)
            setArea(rect.width < 5 && rect.height < 5 ? found[0].rect : rect)
          }}
          style={{
            position: 'fixed', inset: 0, zIndex: 2147483645, cursor: 'crosshair',
            background: 'rgba(217,119,87,.06)',
          }}
        >
          <div style={{
            position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
            padding: '6px 12px', background: '#333', color: '#fff', borderRadius: 6,
            font: '13px sans-serif', pointerEvents: 'none',
          }}>
            수정할 영역을 드래그하거나 클릭하세요 · Esc 취소
          </div>
          {drag && (
            <div style={{
              position: 'fixed', left: drag.x, top: drag.y, width: drag.width, height: drag.height,
              border: '2px dashed #d97757', background: 'rgba(217,119,87,.12)', pointerEvents: 'none',
            }} />
          )}
        </div>
      )}

      {isPicked && (
        <>
          {picked.map(({ rect }, i) => (
            <div key={i} style={{
              position: 'fixed', left: rect.left, top: rect.top, width: rect.width, height: rect.height,
              outline: '2px solid #d97757', zIndex: 2147483645, pointerEvents: 'none',
            }} />
          ))}
          <form
            onSubmit={e => { e.preventDefault(); void send() }}
            style={{
              position: 'fixed', top: formTop, left: Math.max(8, formLeft), zIndex: 2147483646,
              width: 320, padding: 10, background: '#fff', color: '#222', borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,.3)', font: '13px sans-serif',
            }}
          >
            <div style={{ marginBottom: 6, color: '#666' }}>
              요소 {picked.length}개 선택됨 · Enter 보내기 · Shift+Enter 줄바꿈
            </div>
            <textarea
              autoFocus
              value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  void send()
                }
              }}
              placeholder="어떻게 수정할지 설명해 주세요"
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box', padding: 6, resize: 'vertical',
                border: '1px solid #ccc', borderRadius: 4, font: 'inherit', color: '#222', background: '#fff',
              }}
            />
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 6 }}>
              <button type="button" onClick={reset} style={{ padding: '4px 10px', cursor: 'pointer' }}>
                다시 선택
              </button>
              <button type="submit" style={{
                padding: '4px 10px', cursor: 'pointer', background: '#d97757',
                color: '#fff', border: 'none', borderRadius: 4,
              }}>
                Claude에게 보내기
              </button>
            </div>
          </form>
        </>
      )}
    </>
  )
}
