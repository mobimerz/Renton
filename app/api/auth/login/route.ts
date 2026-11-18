import { z } from "zod";
import { cookies } from "next/headers";
import { SESSION_COOKIE, checkCredentials, sessionCookieOptions, signSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").max(200),
  password: z.string().min(1, "Password is required.").max(200),
});

const FAIL_DELAY_MS = 600;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** POST /api/auth/login  { email, password }  ->  sets the httpOnly session cookie. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 422 });

  try {
    const { email, password } = parsed.data;
    if (!(await checkCredentials(email, password))) {
      await sleep(FAIL_DELAY_MS); // slows down password guessing
      return Response.json({ error: "Wrong email or password." }, { status: 401 });
    }
    const token = await signSession(email.trim().toLowerCase());
    (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[admin] login failed:", err);
    return Response.json({ error: "Admin login is not configured on the server." }, { status: 500 });
  }
}
