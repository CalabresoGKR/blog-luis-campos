import Link from "next/link";
import { getContactInfo } from "@/lib/queries";

export async function Footer() {
  const contact = await getContactInfo();

  return (
    <footer className="bg-ink text-paper/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-10 lg:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-paper/10">

          {/* Brand */}
          <div>
            <p className="type-h4 text-paper mb-3">Luís Campos</p>
            <p className="type-footer-body text-paper/45 leading-relaxed">
              Artista plástico e xilografista.<br />Torres Novas, Portugal.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="type-footer-heading text-paper/35 mb-5">Navegação</p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/obras",      label: "Obras" },
                { href: "/exposicoes", label: "Exposições" },
                { href: "/mapa",       label: "Mapa das Obras" },
                { href: "/blog",       label: "Blog" },
                { href: "/sobre",      label: "Sobre" },
                { href: "/contactos",  label: "Contactos" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="type-footer-body text-paper/55 hover:text-paper transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="type-footer-heading text-paper/35 mb-5">Contacto</p>
            <div className="flex flex-col gap-2.5">
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="type-footer-body text-paper/55 hover:text-paper transition-colors duration-200"
                >
                  {contact.email}
                </a>
              )}
              {contact?.phone && (
                <span className="type-footer-body text-paper/55">{contact.phone}</span>
              )}
              {contact?.address && (
                <span className="type-footer-body text-paper/40 leading-relaxed whitespace-pre-line">
                  {contact.address}
                </span>
              )}
              {contact?.socials && contact.socials.length > 0 && (
                <div className="flex gap-5 mt-1">
                  {contact.socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-footer-body text-paper/45 hover:text-paper transition-colors duration-200"
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="type-caption text-paper/25">
            © {new Date().getFullYear()} Luís Campos. Todos os direitos reservados.
          </p>
          <Link
            href="/admin"
            className="type-caption text-paper/15 hover:text-paper/35 transition-colors duration-200"
          >
            Área restrita
          </Link>
        </div>
      </div>
    </footer>
  );
}
