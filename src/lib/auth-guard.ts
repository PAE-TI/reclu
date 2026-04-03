import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSessionFromCookies } from "@/lib/auth-session";
import { findUserById } from "@/lib/auth-store";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session) {
    return null;
  }

  const user = await findUserById(session.userId);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    companyName: user.company_name,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user;
}
