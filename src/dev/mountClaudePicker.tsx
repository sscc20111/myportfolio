import { createRoot } from 'react-dom/client'
import ClaudePicker, { ROOT_ID } from './ClaudePicker'

export function mountClaudePicker() {
  if (document.getElementById(ROOT_ID)) return
  const host = document.createElement('div')
  host.id = ROOT_ID
  document.body.appendChild(host)
  createRoot(host).render(<ClaudePicker />)
}
