"use client";

import { Trash2 } from "lucide-react";
import { deleteMessage } from "@/actions/message";

export function DeleteMessageButton({ id }: { id: string }) {
  const action = deleteMessage.bind(null, id);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Apagar esta mensagem?")) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"
        title="Apagar mensagem"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
