// Transparent pass-through layout — public pages use PublicLayout component directly.
export default function PublicGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
