/**
 * CLOUDABSEN PRO - SUPER WORKER INTERFACE (D1)
 * Features: Multi-role, Payroll, Attendance, Leave, CORS Fix
 */

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const method = request.method;

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        if (method === "OPTIONS") return new Response(null, { headers: corsHeaders });

        try {
            // 1. ROUTE: USERS (GET/POST)
            if (url.pathname === "/api/users") {
                if (method === "GET") {
                    const { results } = await env.DB.prepare("SELECT * FROM users WHERE status = 'active'").all();
                    return new Response(JSON.stringify(results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
                }
                if (method === "POST") {
                    const user = await request.json();
                    await env.DB.prepare("INSERT INTO users (nama, dept, role, base_salary, food_allowance, leave_total, face_data) VALUES (?, ?, ?, ?, ?, ?, ?)")
                        .bind(user.nama, user.dept, user.role || 'pegawai', user.salary || 0, user.food || 0, user.leave || 12, user.face || '')
                        .run();
                    return new Response("User Added", { headers: corsHeaders });
                }
            }

            // 2. ROUTE: ATTENDANCE (POST/GET)
            if (url.pathname === "/api/absensi") {
                if (method === "POST") {
                    const data = await request.json();
                    // Log Attendance
                    await env.DB.prepare("INSERT INTO attendance (user_id, nama, type, lokasi, status) VALUES (?, ?, ?, ?, ?)")
                        .bind(data.user_id, data.nama, data.type, data.lokasi, data.status || 'Verified')
                        .run();
                    return new Response("Recorded", { headers: corsHeaders });
                }
                if (method === "GET") {
                    const { results } = await env.DB.prepare("SELECT * FROM attendance ORDER BY waktu DESC LIMIT 100").all();
                    return new Response(JSON.stringify(results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
                }
            }

            // 3. ROUTE: LEAVE (GET/POST)
            if (url.pathname === "/api/leave") {
                if (method === "POST") {
                    const leave = await request.json();
                    await env.DB.prepare("INSERT INTO leave_requests (user_id, nama, type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?, ?)")
                        .bind(leave.user_id, leave.nama, leave.type, leave.start, leave.end, leave.reason || '')
                        .run();
                    return new Response("Request Sent", { headers: corsHeaders });
                }
                if (method === "GET") {
                    const { results } = await env.DB.prepare("SELECT * FROM leave_requests ORDER BY id DESC").all();
                    return new Response(JSON.stringify(results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
                }
            }

            // 4. ROUTE: PAYROLL (GET)
            if (url.pathname === "/api/payroll") {
                if (method === "GET") {
                    const { results } = await env.DB.prepare("SELECT * FROM users WHERE role = 'pegawai'").all();
                    return new Response(JSON.stringify(results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
                }
            }

            // 5. ROUTE: DELETE LOGS (OLDER THAN 1 YEAR)
            if (url.pathname === "/api/purge" && method === "POST") {
                await env.DB.prepare("DELETE FROM attendance WHERE waktu < date('now','-1 year')").run();
                return new Response("Purge Complete", { headers: corsHeaders });
            }

            return new Response("CloudAbsen Bridge Active", { headers: corsHeaders });

        } catch (e) {
            return new Response(e.message, { status: 500, headers: corsHeaders });
        }
    }
}
