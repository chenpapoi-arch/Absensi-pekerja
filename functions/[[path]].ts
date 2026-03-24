import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono()

// Ini yang ngatur: kalau buka web/login munculnya file login.html
app.get('/login', async (c) => {
  const url = new URL(c.req.url)
  return fetch(`${url.origin}/login.html`)
})

// Kalau buka web/admin munculnya file admin.html
app.get('/admin', async (c) => {
  const url = new URL(c.req.url)
  return fetch(`${url.origin}/admin.html`)
})

export const onRequest = handle(app)

