import { PortalSidebar } from "@/components/layout/portal-sidebar";
import { PortalTopbar } from "@/components/layout/portal-topbar";

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <PortalSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <PortalTopbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

