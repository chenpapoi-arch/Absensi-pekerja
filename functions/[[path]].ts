import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Absensi Pekerja</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-100 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border-t-8 border-blue-600">
            <h1 class="text-2xl font-bold text-slate-800 mb-2">Sistem Absensi Pekerja 🏗️</h1>
            <p class="text-green-600 font-semibold mb-6">● SERVER ONLINE (TERMUX PUSH)</p>
            <div class="space-y-4">
                <p class="text-slate-600 text-sm">Halo, <strong>chenpapoi-arch</strong>! Sistem siap digunakan untuk monitoring proyek.</p>
                <button onclick="alert('Fitur GPS & Kamera Sedang Disiapkan!')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition">
                    Mulai Absen Sekarang
                </button>
            </div>
            <p class="mt-8 text-[10px] text-slate-400">© 2026 Fiberasinet & AST Services Center</p>
        </div>
    </body>
    </html>
  `)
})

export const onRequest = handle(app)

