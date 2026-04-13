interface Props {
  index: string;
  title: string;
  intro?: string;
}

export function SectionLabel({ index, title, intro }: Props) {
  return (
    <div className="mb-16 grid gap-10 border-t border-ink-border pt-10 md:grid-cols-12">
      <div className="md:col-span-4">
        <div className="micro-label">{index}</div>
        <h2 className="mt-3 font-sans text-3xl tracking-tight text-ink-text md:text-4xl">{title}</h2>
      </div>
      {intro && (
        <p className="font-sans text-base leading-relaxed text-ink-dim md:col-span-7 md:col-start-6 md:text-lg">
          {intro}
        </p>
      )}
    </div>
  );
}
