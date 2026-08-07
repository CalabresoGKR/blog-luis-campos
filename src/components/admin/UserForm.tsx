"use client";

import { SubmitButton } from "./SubmitButton";

interface UserFormProps {
  action:        (formData: FormData) => Promise<void>;
  defaultValues?: { name?: string; email?: string; role?: string };
  isEdit?:       boolean;
  submitLabel?:  string;
  error?:        string | null;
}

const input = "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-ink/30 transition-colors";
const lbl   = "block text-xs font-semibold uppercase tracking-wider text-muted/60 mb-2";

const ERROR_MSGS: Record<string, string> = {
  missing: "Preenche todos os campos obrigatórios.",
  short:   "A password deve ter pelo menos 8 caracteres.",
  exists:  "Já existe um utilizador com esse email.",
  self:    "Não podes apagar a tua própria conta.",
};

export function UserForm({ action, defaultValues, isEdit, submitLabel = "Guardar", error }: UserFormProps) {
  return (
    <form action={action} className="space-y-6">
      {error && ERROR_MSGS[error] && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {ERROR_MSGS[error]}
        </div>
      )}

      <div>
        <label className={lbl}>Nome *</label>
        <input name="name" type="text" required defaultValue={defaultValues?.name ?? ""} placeholder="Nome completo" className={input} />
      </div>

      <div>
        <label className={lbl}>Email *</label>
        <input name="email" type="email" required defaultValue={defaultValues?.email ?? ""}
          placeholder="email@exemplo.pt" className={input}
          readOnly={isEdit}
          style={isEdit ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
        />
        {isEdit && <p className="mt-1.5 text-xs text-muted">O email não pode ser alterado.</p>}
      </div>

      <div>
        <label className={lbl}>{isEdit ? "Nova Password" : "Password *"}</label>
        <input name="password" type="password" required={!isEdit} minLength={8}
          placeholder={isEdit ? "Deixa em branco para não alterar" : "Mínimo 8 caracteres"}
          className={input}
        />
      </div>

      <div>
        <label className={lbl}>Função</label>
        <select name="role" defaultValue={defaultValues?.role ?? "EDITOR"} className={input}>
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-line">
        <SubmitButton label={submitLabel} pendingLabel="A guardar..." />
        <a href="/admin/users" className="text-sm text-muted hover:text-ink transition-colors">Cancelar</a>
      </div>
    </form>
  );
}
