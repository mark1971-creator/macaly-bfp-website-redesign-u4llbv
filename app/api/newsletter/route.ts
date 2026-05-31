import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not configured");
    return NextResponse.json(
      { error: "Newsletter service not configured" },
      { status: 503 }
    );
  }

  const { email, name } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const listIds = BREVO_LIST_ID ? [parseInt(BREVO_LIST_ID, 10)] : [];

  const payload: Record<string, unknown> = {
    email,
    updateEnabled: true, // update if contact already exists
    attributes: name ? { FIRSTNAME: name.split(" ")[0], LASTNAME: name.split(" ").slice(1).join(" ") } : {},
  };

  if (listIds.length > 0) {
    payload.listIds = listIds;
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 201 = created, 204 = updated (contact already existed)
    if (res.status === 201 || res.status === 204) {
      console.log("Brevo subscriber added/updated:", email);
      return NextResponse.json({ success: true });
    }

    const errorText = await res.text();
    console.error("Brevo contacts API failed:", res.status, errorText);
    return NextResponse.json({ error: "Failed to add subscriber" }, { status: 500 });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
