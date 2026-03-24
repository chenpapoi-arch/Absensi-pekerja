import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => {
  return c.html(`
    <body style="font-family:sans-serif;text-align:center;padding:50px;background:#f0f2f5;">
      <div style="background:white;padding:30px;border-radius:15px;display:inline-block;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
        <h1>Sistem Absensi Pekerja 🏗️</h1>
        <p style="color:green;font-weight:bold;">SERVER ONLINE</p>
        <hr>
        <p>Halo chenpapoi-arch! Sistem sudah siap digunakan.</p>
        <button onclick="alert('Fitur Absen GPS Segera Hadir!')" style="padding:10px 20px;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;">Mulai Absen Sekarang</button>
      </div>
    </body>
  `)
})

export default app
