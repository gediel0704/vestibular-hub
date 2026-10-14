# Project Architecture Rules

- Keep the academic React/Vite/JavaScript delivery isolated under `deliverables/aprovest-react-js`; the main TanStack product must not import from it.
- The academic app must render a visible configuration or runtime error screen instead of failing to a blank page, so local setup problems remain diagnosable.
- Keep the academic app's public cloud endpoint and publishable key as built-in defaults, with environment variables as optional overrides, so the delivery runs on a clean machine.
- Override academic Vite's Rollup dependency with the matching official WebAssembly distribution to avoid platform-specific optional native dependency failures across machines.
- Academic browser clients use an authenticated HTTP API under `/api/public/academic` for AI, grading and privileged writes; handlers validate identities and roles before admin-client access to protect browser secrets and answer keys.
- Keep SQL Server academic scripts separate from PostgreSQL Cloud migrations and package both with explicit runtime prerequisites so each delivery matches its execution engine.
- Academic AI evaluations preserve the submitted essay snapshot and board-specific feedback; never replace historical corrections when a student edits a draft.