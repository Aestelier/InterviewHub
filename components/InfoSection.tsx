type InfoSectionProps = {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
};

export function InfoSection({ eyebrow, title, children }: InfoSectionProps) {
  return (
    <section className="border-t border-line py-14 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[0.9fr_1.6fr] md:px-8">
        <div>
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
            {title}
          </h2>
        </div>
        <div className="text-base leading-7 text-muted md:text-lg">{children}</div>
      </div>
    </section>
  );
}
