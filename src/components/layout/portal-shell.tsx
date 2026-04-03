import { PortalSidebar } from "@/components/layout/portal-sidebar";
import { PortalTopbar } from "@/components/layout/portal-topbar";
import type { CurrentUser } from "@/lib/auth-types";

type PortalShellProps = {
  children: React.ReactNode;
  user: CurrentUser;
};

export function PortalShell({ children, user }: PortalShellProps) {
  return (
    <div className="reclu-portal-shell flex min-h-screen">
      <PortalSidebar user={user} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <PortalTopbar user={user} />
        <main className="flex-1 px-4 py-5 md:px-6 lg:px-7 lg:py-6">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
