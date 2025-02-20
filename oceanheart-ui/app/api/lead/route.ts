import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/libs/supabase/server";

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const supabase = createClient();

    // TODO: leads table needs service role policy to be set up for read access
    const { data: existingLead, error: selectError } = await supabase
      .from("leads")
      .select("email")
      .ilike("email", body.email)
      .maybeSingle();

    if (selectError) {
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    if (existingLead) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 });
    }

    // Insert the new lead if not already subscribed
    await supabase.from("leads").insert({ email: body.email });
    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
