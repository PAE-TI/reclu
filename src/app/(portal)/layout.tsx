import { PortalShell } from "@/components/layout/portal-shell";
import { requireUser } from "@/lib/auth-guard";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <PortalShell>{children}</PortalShell>;
}
