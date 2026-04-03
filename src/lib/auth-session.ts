import crypto from "node:crypto";
export const AUTH_COOKIE_NAME = "reclu_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: number;
  email: string;
  exp: number;
};

export function createSessionToken(input: { userId: number; email: string }) {
  const payload: SessionPayload = {
    userId: input.userId,
    email: input.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (!payload.userId || !payload.email) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

type CookieStoreLike = {
  get: (name: string) => { value: string } | undefined;
};

export function getSessionFromCookies(cookieStore: CookieStoreLike) {
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export function getSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    name: AUTH_COOKIE_NAME,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: isProd,
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    },
  };
}

function sign(value: string) {
  const secret = getAuthSecret();
  return encodeBase64Url(crypto.createHmac("sha256", secret).update(value).digest());
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }
  return secret;
}

function encodeBase64Url(input: string | Buffer) {
  const raw = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return raw
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, "base64").toString("utf8");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
