import { getContactInfo } from "@/lib/queries";
import { PublicLayout } from "@/components/public/PublicLayout";
import { FadeIn } from "@/components/public/FadeIn";
import { ContactFormClient } from "@/components/public/ContactFormClient";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactos — Luís Campos",
  description: "Contacte o artista plástico Luís Campos para exposições, obras e informações.",
};

export default async function ContactosPage() {
  const contact = await getContactInfo();

  return (
    <PublicLayout>

      {/* Header */}
      <section className="pt-40 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
        <FadeIn>
          <span className="type-overline text-accent block mb-8">Contacto</span>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="type-display-lg text-ink">Vamos<br />conversar.</h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="type-subtitle-lg text-muted mt-7 max-w-md">
            Para informações sobre obras, exposições, colaborações ou aquisições, não hesite em entrar em contacto.
          </p>
        </FadeIn>
      </section>

      <section className="px-6 lg:px-10 pb-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Contact info */}
          <div className="space-y-8">
            {contact?.email && (
              <FadeIn>
                <div className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                    <Mail size={17} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="type-form-label text-muted/50 mb-2">Email</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="type-body text-ink hover:text-accent transition-colors duration-200"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              </FadeIn>
            )}

            {contact?.phone && (
              <FadeIn delay={100}>
                <div className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                    <Phone size={17} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="type-form-label text-muted/50 mb-2">Telefone</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="type-body text-ink hover:text-accent transition-colors duration-200"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </FadeIn>
            )}

            {contact?.address && (
              <FadeIn delay={200}>
                <div className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                    <MapPin size={17} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="type-form-label text-muted/50 mb-2">Morada</p>
                    <p className="type-body text-ink whitespace-pre-line">{contact.address}</p>
                  </div>
                </div>
              </FadeIn>
            )}

            {contact?.hours && (
              <FadeIn delay={300}>
                <div className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                    <Clock size={17} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="type-form-label text-muted/50 mb-2">Horário</p>
                    <p className="type-body text-ink whitespace-pre-line">{contact.hours}</p>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Socials */}
            {contact?.socials && contact.socials.length > 0 && (
              <FadeIn delay={400}>
                <div className="pt-4 border-t border-line">
                  <p className="type-form-label text-muted/50 mb-5">Redes Sociais</p>
                  <div className="flex flex-col gap-3">
                    {contact.socials.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="type-nav text-muted hover:text-ink transition-colors duration-200 inline-flex items-center gap-2"
                      >
                        {social.platform}
                        <span className="text-line">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {!contact && (
              <FadeIn>
                <p className="type-body text-muted">
                  As informações de contacto serão adicionadas em breve.
                </p>
              </FadeIn>
            )}
          </div>

          {/* Form */}
          <FadeIn delay={100}>
            <ContactFormClient />
          </FadeIn>
        </div>
      </section>
    </PublicLayout>
  );
}
