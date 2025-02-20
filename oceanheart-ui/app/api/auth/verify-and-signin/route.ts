export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { recaptchaToken } = await request.json();

  // Verify reCAPTCHA token
  const recaptchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    { method: "POST" }
  );
  const recaptchaData = await recaptchaResponse.json();

  if (!recaptchaData.success) {
    return Response.json({ error: "Invalid captcha" }, { status: 400 });
  }

  return Response.json({ success: true });
}
