/**
 * CLOUDFLARE WORKER - FIX CORS & D1 INTEGRATION
 * Copy & Paste this into your Cloudflare Worker Editor.
 * Make sure to bind your D1 database with the name "DB".
 */

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // --- 1. HANDLE CORS PREFLIGHT (OPTIONS) ---
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // --- 2. GET REKAP (GET) ---
            if (request.method === "GET") {
                const { results } = await env.DB.prepare(
                    "SELECT * FROM absensi ORDER BY waktu DESC LIMIT 100"
                ).all();

                return new Response(JSON.stringify(results), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // --- 3. SUBMIT ABSEN (POST) ---
            if (request.method === "POST") {
                const data = await request.json();

                if (!data.nama || !data.lokasi) {
                    return new Response("Missing Data", { status: 400, headers: corsHeaders });
                }

                await env.DB.prepare(
                    "INSERT INTO absensi (nama, lokasi, waktu, status) VALUES (?, ?, ?, ?)"
                ).bind(data.nama, data.lokasi, new Date().toISOString(), 'Verified').run();

                return new Response("OK", { status: 200, headers: corsHeaders });
            }

        } catch (err) {
            // --- 4. HANDLE ERROR 500 ---
            return new Response(err.message, {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "text/plain" }
            });
        }

        return new Response("Not Found", { status: 404, headers: corsHeaders });
    }
};
