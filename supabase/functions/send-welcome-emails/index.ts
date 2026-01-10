import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SmtpClient } from "https://deno.land/x/smtp@v0.8.0/mod.ts";

// Environment variables (set these as function secrets)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const AOTSEND_HOST = Deno.env.get("AOTSEND_HOST") || "smtp.aotsend.example";
const AOTSEND_PORT = Number(Deno.env.get("AOTSEND_PORT") || "587");
const AOTSEND_USER = Deno.env.get("AOTSEND_USER") || "";
const AOTSEND_PASS = Deno.env.get("AOTSEND_PASS") || "";
const AOTSEND_FROM = Deno.env.get("AOTSEND_FROM") || "noreply@yourdomain.com";
const PROCESS_LIMIT = Number(Deno.env.get("PROCESS_LIMIT") || "10");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase URL or service role key. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as function secrets.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function sendEmail(smtpClient: SmtpClient, recipient: string, subject: string, body: string) {
  await smtpClient.send({
    to: recipient,
    from: AOTSEND_FROM,
    subject,
    content: body,
  });
}

async function processQueue() {
  // Initialize SMTP client
  const smtpClient = new SmtpClient();
  try {
    await smtpClient.connectTLS({
      hostname: AOTSEND_HOST,
      port: AOTSEND_PORT,
      username: AOTSEND_USER,
      password: AOTSEND_PASS,
    });

    // Fetch unsent queued emails
    const { data, error } = await supabase
      .from("auth_email_queue")
      .select("id, recipient, subject, body")
      .eq("sent", false)
      .order("created_at", { ascending: true })
      .limit(PROCESS_LIMIT);

    if (error) {
      console.error("Error querying auth_email_queue:", error);
      return { processed: 0, error: error.message };
    }

    let processed = 0;
    for (const row of data ?? []) {
      try {
        await sendEmail(smtpClient, row.recipient, row.subject, row.body);
        await supabase
          .from("auth_email_queue")
          .update({ sent: true, sent_at: new Date().toISOString() })
          .eq("id", row.id);
        processed++;
      } catch (e) {
        console.error("Failed to send email to", row.recipient, e);
        // continue with other messages
      }
    }

    await smtpClient.close();
    return { processed };
  } catch (err) {
    try { await smtpClient.close(); } catch (_) {}
    console.error("SMTP/processing error:", err);
    return { processed: 0, error: err.message };
  }
}

serve(async (req) => {
  // Optional simple health check
  if (req.method === "GET") {
    return new Response(JSON.stringify({ status: "ok" }), { headers: { "Content-Type": "application/json" } });
  }

  // POST triggers immediate processing
  if (req.method === "POST") {
    try {
      const res = await processQueue();
      return new Response(JSON.stringify({ ok: true, result: res }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
