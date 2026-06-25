import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-brand-foreground"
            style={{ backgroundColor: "var(--brand)" }}
            aria-hidden
          >
            <span className="font-display text-lg font-bold">A</span>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Apro<span style={{ color: "var(--brand)" }}>Vest</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-sm font-medium text-foreground" }}
            activeOptions={{ exact: true }}
          >
            Início
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-sm font-medium text-foreground" }}
          >
            Sobre
          </Link>
        </nav>

        <a
          href="#cta"
          className="hidden rounded-full px-5 py-2 text-sm font-semibold text-brand-foreground transition-transform hover:-translate-y-0.5 md:inline-flex"
          style={{ backgroundColor: "var(--brand)" }}
        >
          Começar grátis
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div>
          <p className="font-display text-lg font-bold text-foreground">
            Apro<span style={{ color: "var(--brand)" }}>Vest</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sua aprovação começa com dados, não com sorte.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} AproVest. Projeto acadêmico — TCC.
        </p>
      </div>
    </footer>
  );
}