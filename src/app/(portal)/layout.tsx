import { PortalShell } from "@/components/layout/portal-shell";
import { requireUser } from "@/lib/auth-guard";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <PortalShell user={user}>{children}</PortalShell>;
}
