import { NextRequest, NextResponse } from "next/server";
import {
  checkSubmissionSpam,
  getClientIp,
  stripSpamFields,
} from "@/lib/form-spam-guard";

export async function POST(req: NextRequest) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not configured");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  const body = (await req.json()) as Record<string, unknown>;
  const spam = checkSubmissionSpam(body, getClientIp(req));

  if (spam !== "ok") {
    console.warn("Contact form blocked:", spam);
    return NextResponse.json({ success: true });
  }

  const { type, ...fields } = stripSpamFields(body);

  const rows = Object.entries(fields)
    .map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
      return `<tr><td style="padding:6px 12px;font-weight:600;color:#7a6b45;white-space:nowrap;">${label}</td><td style="padding:6px 12px;color:#1a2744;">${value || "—"}</td></tr>`;
    })
    .join("");

  const subjectMap: Record<string, string> = {
    contact: "New Contact Form Submission — BEING at Full Potential",
    hpcc: "New HPCC Application — BEING at Full Potential",
    idg: "New IDG Certification Registration — BEING at Full Potential",
  };

  const formType = typeof type === "string" ? type : "contact";
  const subject = subjectMap[formType] ?? "New Form Submission — BEING at Full Potential";

  const htmlContent = `
    <div style="font-family:'Lato',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e8e4dc;padding:32px;">
      <h2 style="font-family:Georgia,serif;color:#1a2744;margin-top:0;">${subject}</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;background:#f9f8f5;border-radius:4px;">
        ${rows}
      </table>
      <p style="margin-top:24px;font-size:12px;color:#999;">Sent from beingatfullpotential.com</p>
    </div>
  `;

  const email = typeof fields.email === "string" ? fields.email : undefined;

  const payload = {
    sender: { name: "BEING at Full Potential Website", email: "mark@beingatfullpotential.com" },
    to: [{ email: "mark@beingatfullpotential.com", name: "Mark Vandeneijnde" }],
    replyTo: email ? { email } : undefined,
    subject,
    htmlContent,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Brevo transactional email failed:", res.status, errorText);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    console.log("Contact email sent successfully via Brevo, type:", formType);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
