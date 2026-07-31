"use client";

import { useFormStatus } from "react-dom";

interface Props {
  label: string;
  pendingLabel?: string;
}

export function SubmitButton({ label, pendingLabel = "A guardar..." }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-full bg-ink px-8 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
    >
      {pending && (
        <span className="h-4 w-4 rounded-full border-2 border-paper/30 border-t-paper animate-spin" />
      )}
      {pending ? pendingLabel : label}
    </button>
  );
}
