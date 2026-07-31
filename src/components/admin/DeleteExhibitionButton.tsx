"use client";

import { Trash2 } from "lucide-react";
import { deleteExhibition } from "@/actions/exhibition";

export function DeleteExhibitionButton({ id }: { id: string }) {
  const action = deleteExhibition.bind(null, id);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Tens a certeza que queres apagar esta exposição?\nEsta ação não pode ser desfeita.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Apagar
      </button>
    </form>
  );
}
