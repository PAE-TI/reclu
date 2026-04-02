import { PageTemplate } from "@/components/portal/page-template";

export default function CreditsPurchasePage() {
  return (
    <PageTemplate
      description="Compra de creditos para envio de evaluaciones y operacion del portal."
      highlights={[
        "Selector de cantidad de creditos",
        "Total estimado y resumen de compra",
        "Base para integracion de pagos",
      ]}
      details={[
        "Integrar proveedor de pago en sandbox.",
        "Persistir transaccion y recarga de saldo.",
        "Emitir comprobante de operacion.",
      ]}
      badge="Comprar Creditos"
      title="Comprar creditos"
    />
  );
}
