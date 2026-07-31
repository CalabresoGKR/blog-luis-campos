"use client";

import { Trash2 } from "lucide-react";
import { deleteArtwork } from "@/actions/artwork";

export function DeleteArtworkButton({ id }: { id: string }) {
  const action = deleteArtwork.bind(null, id);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Tens a certeza que queres apagar esta obra?\nEsta ação não pode ser desfeita.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
        Apagar
      </button>
    </form>
  );
}
