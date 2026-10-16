export default function HomePage() {
  const tokens = [
    { name: "void", bg: "bg-void" },
    { name: "night", bg: "bg-night" },
    { name: "navy", bg: "bg-navy" },
    { name: "royal", bg: "bg-royal" },
    { name: "electric", bg: "bg-electric" },
    { name: "white", bg: "bg-white" },
    { name: "surface-1", bg: "bg-surface-1" },
    { name: "surface-2", bg: "bg-surface-2" },
    { name: "electric-hover", bg: "bg-electric-hover" },
    { name: "electric-400", bg: "bg-electric-400" },
    { name: "electric-300", bg: "bg-electric-300" },
    { name: "electric-200", bg: "bg-electric-200" },
    { name: "fg", bg: "bg-fg" },
    { name: "fg-muted", bg: "bg-fg-muted" },
    { name: "fg-subtle", bg: "bg-fg-subtle" },
    { name: "line", bg: "bg-line" },
    { name: "line-strong", bg: "bg-line-strong" },
  ];

  return (
    <div className="min-h-screen p-8 md:p-16">
      <div className="max-w-4xl space-y-8">
        <div>
          <span className="text-label font-label text-electric-300">Phase 0 Token Test</span>
          <h1 className="mt-2 text-display-xl font-display text-white">
            ARCHITECTING <em className="font-accent font-normal text-electric-300 italic">digital</em> SYSTEMS
          </h1>
        </div>

        <p className="text-body text-fg-muted">
          Testing design tokens, fluid typography scaling, and theme resets. All content here is styled
          strictly using configured tokens without hardcoded hex values.
        </p>

        <div>
          <h2 className="mb-4 text-label font-label text-fg-subtle">Palette Tokens</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {tokens.map((token) => (
              <div
                key={token.name}
                className="rounded-md border border-line bg-surface-1 p-3 text-center transition-colors"
              >
                <div
                  className={`h-12 w-full rounded-sm border border-line-strong ${token.bg}`}
                  title={token.name}
                />
                <span className="mt-2 block text-micro font-label text-fg-muted">{token.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
