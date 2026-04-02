import Link from "next/link";
import { PageTemplate } from "@/components/portal/page-template";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        description="Panel de administracion para usuarios, creditos, compras y configuraciones globales."
        highlights={[
          "Configuracion de registro y creditos",
          "Bloque de ventas y pricing",
          "Listado de usuarios y estados",
          "Acceso a banco de preguntas tecnicas",
        ]}
        nextMilestones={[
          "Conectar reglas reales de creditos.",
          "Integrar pagos y transacciones en DB.",
          "Administrar usuarios desde backend seguro.",
        ]}
        phase="Etapa 1"
        title="Administracion"
      />
      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">Pruebas tecnicas</h3>
        <p className="mt-2 text-sm text-slate-600">
          La gestion del banco tecnico queda accesible desde esta etapa para mantener la
          estructura del sistema original.
        </p>
        <Link
          className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          href="/admin/technical-questions"
        >
          Gestionar preguntas
        </Link>
      </section>
    </div>
  );
}

