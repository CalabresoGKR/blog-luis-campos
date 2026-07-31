import { CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { ContactForm } from "@/components/admin/ContactForm";
import { updateContact } from "@/actions/contact";

interface Props {
  searchParams: Promise<{ saved?: string }>;
}

export default async function ContactsAdminPage({ searchParams }: Props) {
  const { saved } = await searchParams;

  const contact = await prisma.contactInfo.findUnique({
    where:   { key: "contact" },
    include: { socials: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <PageHeader
        title="Contactos"
        description="Informação de contacto visível em /contactos"
        action={
          <Link
            href="/contactos"
            target="_blank"
            className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink hover:border-ink/30 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Ver página
          </Link>
        }
      />

      {saved === "1" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-700">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          Contactos guardados com sucesso. A página pública foi atualizada.
        </div>
      )}

      <div className="max-w-2xl bg-paper rounded-xl border border-line p-8">
        <ContactForm
          action={updateContact}
          defaultValues={{
            email:   contact?.email,
            phone:   contact?.phone,
            address: contact?.address,
            hours:   contact?.hours,
            socials: contact?.socials.map((s) => ({ platform: s.platform, url: s.url })),
          }}
        />
      </div>
    </div>
  );
}
