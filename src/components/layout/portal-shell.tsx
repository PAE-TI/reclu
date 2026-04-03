import { PortalSidebar } from "@/components/layout/portal-sidebar";
import { PortalTopbar } from "@/components/layout/portal-topbar";

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="reclu-portal-shell flex min-h-screen">
      <PortalSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <PortalTopbar />
        <main className="flex-1 px-4 py-5 md:px-6 lg:px-7 lg:py-6">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
