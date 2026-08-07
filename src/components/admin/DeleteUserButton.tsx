"use client";

import { Trash2 } from "lucide-react";
import { deleteUser } from "@/actions/user";

export function DeleteUserButton({ id, isSelf }: { id: string; isSelf: boolean }) {
  if (isSelf) return null;

  const action = deleteUser.bind(null, id);
  return (
    <form action={action} onSubmit={(e) => {
      if (!confirm("Apagar este utilizador? Esta ação não pode ser desfeita.")) e.preventDefault();
    }}>
      <button type="submit" className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors" title="Apagar">
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
