// Supabase Edge Function: contact-form
//
// Receives a JSON POST { name, email, subject, message } from the public
// /contact form, validates it, and forwards via Resend
// (https://resend.com) to the Shield360 inbox.
//
// ─── Deploy ──────────────────────────────────────────────────────────────
//   1. Sign up at https://resend.com — verify a sender domain or use the
//      onboarding@resend.dev sandbox sender for testing.
//   2. Set secrets on the Supabase project:
//        supabase secrets set RESEND_API_KEY=re_xxx
//        supabase secrets set CONTACT_TO_EMAIL=akeshchandrasiri@gmail.com
//        supabase secrets set CONTACT_FROM_EMAIL='Shield360 <noreply@your-verified-domain>'
//   3. Deploy:
//        supabase functions deploy contact-form --no-verify-jwt
//   4. The frontend reads the function URL from VITE_CONTACT_FORM_URL.
//      Default: https://<project-ref>.supabase.co/functions/v1/contact-form
//
// ─── Local dev ───────────────────────────────────────────────────────────
//   supabase functions serve contact-form --env-file ./supabase/.env.local
// ─────────────────────────────────────────────────────────────────────────

// deno-lint-ignore-file no-explicit-any
declare const Deno: { env: { get: (k: string) => string | undefined } };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

Deno.serve?.(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const name = String(body?.name ?? "").trim().slice(0, 120);
  const email = String(body?.email ?? "").trim().slice(0, 254);
  const subject = String(body?.subject ?? "").trim().slice(0, 200);
  const message = String(body?.message ?? "").trim().slice(0, 5000);

  if (!name || !email || !subject || !message) {
    return new Response(JSON.stringify({ error: "All fields required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const CONTACT_TO_EMAIL = Deno.env.get("CONTACT_TO_EMAIL");
  const CONTACT_FROM_EMAIL =
    Deno.env.get("CONTACT_FROM_EMAIL") || "Shield360 <onboarding@resend.dev>";

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    return new Response(
      JSON.stringify({ error: "Email service not configured" }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const html = `
    <div style="font-family:-apple-system,Segoe UI,sans-serif;color:#1A1A2E;line-height:1.6;">
      <h2 style="color:#9B82CC;margin:0 0 14px;">New contact from Shield360</h2>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 12px 4px 0;color:#8A8A8A;">From</td><td>${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8A8A8A;">Subject</td><td>${escapeHtml(subject)}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:18px 0;">
      <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;margin:0;">${escapeHtml(message)}</pre>
    </div>
  `;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `[Shield360 contact] ${subject}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      return new Response(
        JSON.stringify({ error: "Email provider error", detail: errText }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Send failed", detail: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
