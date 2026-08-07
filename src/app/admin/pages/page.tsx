import { CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateHomePage, updateAboutPage } from "@/actions/pages";

const input    = "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-ink/30 transition-colors";
const textarea = `${input} resize-y`;
const lbl      = "block text-xs font-semibold uppercase tracking-wider text-muted/60 mb-2";

interface Props {
  searchParams: Promise<{ saved?: string }>;
}

export default async function PagesAdminPage({ searchParams }: Props) {
  const { saved } = await searchParams;

  const [home, about] = await Promise.all([
    prisma.homePage.findFirst(),
    prisma.aboutPage.findFirst(),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader title="Conteúdo das Páginas" description="Edita os textos de cada página do site" />

      {saved && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-700">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          {saved === "home" ? "Página Inicial guardada." : "Página Sobre guardada."} O site foi atualizado automaticamente.
        </div>
      )}

      {/* ── PÁGINA INICIAL ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">Página Inicial</h2>
          <Link href="/" target="_blank" className="flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> Ver página
          </Link>
        </div>
        <form action={updateHomePage} className="bg-paper rounded-xl border border-line p-6 space-y-6">
          <div>
            <label className={lbl}>Texto do Hero</label>
            <textarea name="mainText" rows={3} defaultValue={home?.mainText ?? ""} className={textarea}
              placeholder={"Xilogravura é uma arte de subtração.\nO artista remove tudo o que não é a obra —\no que sobra é a imagem."} />
            <p className="mt-1.5 text-xs text-muted">Aparece abaixo do nome no hero. Usa Enter para nova linha.</p>
          </div>
          <div>
            <label className={lbl}>Citação</label>
            <textarea name="quote" rows={2} defaultValue={home?.quote ?? ""} className={textarea}
              placeholder="A madeira guarda a memória de cada golpe..." />
            <p className="mt-1.5 text-xs text-muted">Aparece na secção central em destaque.</p>
          </div>
          <div>
            <label className={lbl}>Banda Animada (Marquee)</label>
            <input name="marqueeText" type="text" defaultValue={home?.marqueeText ?? ""} className={input}
              placeholder="Xilogravura · Arte Plástica · Torres Novas · Portugal" />
            <p className="mt-1.5 text-xs text-muted">Separa os itens com · (ponto centrado).</p>
          </div>
          <div className="pt-2 border-t border-line">
            <SubmitButton label="Guardar Página Inicial" pendingLabel="A guardar..." />
          </div>
        </form>
      </section>

      {/* ── PÁGINA SOBRE ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">Página Sobre</h2>
          <Link href="/sobre" target="_blank" className="flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> Ver página
          </Link>
        </div>
        <form action={updateAboutPage} className="bg-paper rounded-xl border border-line p-6 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={lbl}>Nascimento / Local</label>
              <input name="birthplace" type="text" defaultValue={about?.birthplace ?? ""} className={input} placeholder="1985, Zibreira" />
            </div>
            <div>
              <label className={lbl}>Técnica Principal</label>
              <input name="mainTechnique" type="text" defaultValue={about?.mainTechnique ?? ""} className={input} placeholder="Xilogravura" />
            </div>
            <div>
              <label className={lbl}>Curadoria</label>
              <input name="curatorRole" type="text" defaultValue={about?.curatorRole ?? ""} className={input} placeholder="H. dos Cavaleiros" />
            </div>
          </div>

          <div>
            <label className={lbl}>Subtítulo do Hero</label>
            <textarea name="heroSubtitle" rows={2} defaultValue={about?.heroSubtitle ?? ""} className={textarea}
              placeholder={"Artista plástico e xilografista.\nZibreira, Torres Novas — Portugal."} />
          </div>

          <div>
            <label className={lbl}>Biografia</label>
            <textarea name="biography" rows={7} defaultValue={about?.biography ?? ""} className={textarea}
              placeholder="Texto biográfico do artista..." />
            <p className="mt-1.5 text-xs text-muted">Separa parágrafos com uma linha em branco.</p>
          </div>

          <div>
            <label className={lbl}>Percurso Artístico</label>
            <textarea name="artisticJourney" rows={3} defaultValue={about?.artisticJourney ?? ""} className={textarea} />
          </div>

          <div>
            <label className={lbl}>Formação</label>
            <textarea name="education" rows={4} defaultValue={about?.education ?? ""} className={textarea}
              placeholder="Arteterapia (2020–2022) — Curadoria (2022)" />
            <p className="mt-1.5 text-xs text-muted">Formato recomendado: Disciplina — Ano (uma por linha)</p>
          </div>

          <div>
            <label className={lbl}>Influências</label>
            <textarea name="influences" rows={3} defaultValue={about?.influences ?? ""} className={textarea} />
          </div>

          <div>
            <label className={lbl}>Citação Final</label>
            <textarea name="institutionalText" rows={2} defaultValue={about?.institutionalText ?? ""} className={textarea}
              placeholder="Aparece na secção final com fundo escuro." />
          </div>

          <div className="pt-2 border-t border-line">
            <SubmitButton label="Guardar Página Sobre" pendingLabel="A guardar..." />
          </div>
        </form>
      </section>
    </div>
  );
}
