import { PageHeader } from "./PageHeader";

// Estrutura visual coerente para os módulos cujo CRUD será
// implementado nas fases seguintes do plano.
export function ModulePlaceholder({
  title,
  description,
  features,
}: {
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="rounded-xl border border-dashed border-line bg-paper p-8">
        <p className="text-sm font-medium text-ink">
          Módulo preparado. Funcionalidades planeadas:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
