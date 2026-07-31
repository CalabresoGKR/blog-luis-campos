import { Mail, MailOpen, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteMessageButton } from "@/components/admin/DeleteMessageButton";
import { markAsRead } from "@/actions/message";

function formatDate(d: Date) {
  return new Date(d).toLocaleString("pt-PT", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function MessagesAdminPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <PageHeader
        title="Mensagens"
        description={
          unread > 0
            ? `${unread} não lida${unread !== 1 ? "s" : ""} · ${messages.length} total`
            : `${messages.length} mensagem${messages.length !== 1 ? "s" : ""}`
        }
      />

      {messages.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-line bg-canvas p-20 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-paper border border-line">
            <Inbox className="h-7 w-7 text-muted/40" />
          </div>
          <h3 className="font-display text-lg text-ink mb-2">Nenhuma mensagem ainda</h3>
          <p className="text-sm text-muted max-w-xs mx-auto">
            As mensagens enviadas em /contactos aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-2xl border bg-paper overflow-hidden transition-colors ${
                msg.read ? "border-line" : "border-ink/20 shadow-sm"
              }`}
            >
              {/* Cabeçalho */}
              <div className="flex items-start gap-4 px-6 py-5">
                <div className={`mt-0.5 flex-shrink-0 ${msg.read ? "text-muted/30" : "text-ink"}`}>
                  {msg.read
                    ? <MailOpen className="h-5 w-5" />
                    : <Mail className="h-5 w-5" />
                  }
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`font-semibold text-sm ${msg.read ? "text-muted" : "text-ink"}`}>
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-ink text-paper px-2 py-0.5 rounded-full">
                        Novo
                      </span>
                    )}
                    <span className="text-xs text-muted/50 ml-auto flex-shrink-0">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted mb-3">
                    <a href={`mailto:${msg.email}`} className="hover:text-ink transition-colors">
                      {msg.email}
                    </a>
                    {msg.subject && (
                      <>
                        <span className="text-line">·</span>
                        <span className="text-muted/70">{msg.subject}</span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">
                    {msg.body}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!msg.read && (
                    <form action={markAsRead.bind(null, msg.id)}>
                      <button
                        type="submit"
                        className="p-2 rounded-lg hover:bg-canvas text-muted hover:text-ink transition-colors text-xs"
                        title="Marcar como lido"
                      >
                        <MailOpen className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject ?? "A sua mensagem")}`}
                    className="p-2 rounded-lg hover:bg-canvas text-muted hover:text-ink transition-colors"
                    title="Responder por email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <DeleteMessageButton id={msg.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
