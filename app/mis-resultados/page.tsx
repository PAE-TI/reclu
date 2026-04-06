import PublicHeader from '@/components/public-header';
import ResultsPortalClient from '@/components/results-portal-client';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Mail, Download, FileText } from 'lucide-react';

export default function MisResultadosPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#f8fafc_100%)]">
      <PublicHeader />
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 px-6 py-8 text-white sm:px-8 sm:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.16),_transparent_28%)]" />
              <div className="relative">
                <Badge className="mb-4 border-white/10 bg-white/10 text-cyan-100">
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                  Portal privado
                </Badge>
                <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                  Ver mis resultados
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                  Accede con tu correo y un código temporal para revisar tus pruebas, ver su estado y descargar los reportes disponibles desde un solo lugar.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Mail, label: 'Acceso por correo' },
                    { icon: FileText, label: 'Historial de pruebas' },
                    { icon: Download, label: 'Descarga disponible' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                        <div className="rounded-xl bg-white/10 p-2">
                          <Icon className="h-4 w-4 text-cyan-200" />
                        </div>
                        <span className="text-sm font-medium text-slate-100">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center bg-slate-50 px-6 py-8 sm:px-8">
              <div className="max-w-md">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Acceso temporal y seguro
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  El portal está pensado para que cualquier persona que haya realizado una prueba pueda consultar sus resultados de forma clara, privada y sin iniciar sesión en la plataforma principal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ResultsPortalClient />
    </main>
  );
}
