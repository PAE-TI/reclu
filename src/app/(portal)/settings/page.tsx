import Link from "next/link";
import { PageTemplate } from "@/components/portal/page-template";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        description="Configuracion de cuenta, creditos y preferencias operativas."
        highlights={[
          "Vista base de saldo de creditos",
          "Historial de transacciones",
          "Panel de notificaciones",
        ]}
        details={[
          "Conectar ledger real de creditos.",
          "Activar preferencias de notificaciones.",
          "Sincronizar idioma por usuario.",
        ]}
        badge="Configuracion"
        title="Configuracion"
      />
      <Link
        className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        href="/credits/purchase"
      >
        Comprar creditos
      </Link>
    </div>
  );
}
