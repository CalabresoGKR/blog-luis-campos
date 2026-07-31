import { FadeIn } from "./FadeIn";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionTitleProps) {
  const alignClass = align === "center"
    ? "text-center items-center"
    : "text-left items-start";

  return (
    <div className={`flex flex-col gap-4 ${alignClass}`}>
      {eyebrow && (
        <FadeIn>
          <span className="type-overline text-accent">{eyebrow}</span>
        </FadeIn>
      )}
      <FadeIn delay={100}>
        <h2 className="type-h2 text-ink">{title}</h2>
      </FadeIn>
      {subtitle && (
        <FadeIn delay={200}>
          <p className="type-subtitle-lg text-muted max-w-xl">{subtitle}</p>
        </FadeIn>
      )}
    </div>
  );
}
