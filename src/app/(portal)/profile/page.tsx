import Link from "next/link";
import { PageTemplate } from "@/components/portal/page-template";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        description="Perfil empresarial del administrador y su organizacion."
        highlights={[
          "Datos de cuenta y empresa",
          "Acceso a edicion de perfil",
          "Bloque de seguridad de cuenta",
        ]}
        details={[
          "Persistir informacion editable en DB.",
          "Agregar flujo real de cambio de password.",
        ]}
        badge="Perfil Empresarial"
        title="Perfil empresarial"
      />
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          href="/profile/edit"
        >
          Editar perfil
        </Link>
      </div>
    </div>
  );
}
