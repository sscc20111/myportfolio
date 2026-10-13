import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Dev server only: receives src/dev/ClaudePicker's requests and drops each
// into .claude/inbox/, where the Claude Code "browser-pick" mod picks it up.
const claudeInbox = (): Plugin => ({
  name: 'claude-inbox',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.method !== 'POST' || !req.url?.endsWith('/__claude/pick')) return next()
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', () => {
        try {
          const pick = JSON.parse(body)
          const dir = join(server.config.root, '.claude', 'inbox')
          mkdirSync(dir, { recursive: true })
          writeFileSync(join(dir, `${Number(pick.id) || Date.now()}.json`), JSON.stringify(pick, null, 2))
          res.statusCode = 204
        } catch {
          res.statusCode = 400
        }
        res.end()
      })
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    claudeInbox(),
  ],
  base: '/myportfolio/',

})
