# Project Architecture Rules

- Keep the academic React/Vite/JavaScript delivery isolated under `deliverables/aprovest-react-js`; the main TanStack product must not import from it.
- The academic app must render a visible configuration or runtime error screen instead of failing to a blank page, so local setup problems remain diagnosable.
- Keep the academic app's public cloud endpoint and publishable key as built-in defaults, with environment variables as optional overrides, so the delivery runs on a clean machine.
- Override academic Vite's Rollup dependency with the matching official WebAssembly distribution to avoid platform-specific optional native dependency failures across machines.
- Academic browser clients use an authenticated HTTP API under `/api/public/academic` for AI, grading and privileged writes; handlers validate identities and roles before admin-client access to protect browser secrets and answer keys.
- Academic API clients default to a stable hosted endpoint, with explicit environment overrides for local development; this avoids requiring a second server on each evaluator's computer, but the hosted API must be published first.
- Keep SQL Server academic scripts separate from PostgreSQL Cloud migrations and package both with explicit runtime prerequisites so each delivery matches its execution engine.
- Academic AI evaluations preserve the submitted essay snapshot and board-specific feedback; never replace historical corrections when a student edits a draft.
- Consume the community ENEM question bank only through its external HTTP API and keep it complementary to the curated academic engine, avoiding GPL source-code coupling and provider lock-in.
- Keep official academic references in a browser-safe curated catalog with provenance and edition labels; external links are not imported interactive items or republication licenses.
- Academic study priorities use completed assessments from the selected exam and each subject's latest valid ratio, excluding completed readings; keep this deterministic heuristic separate from TRI and AI.
- Academic npm lifecycle scripts validate supported Node versions and probe the hosted API without credentials; network warnings must not block offline UI startup because installation and hosted service availability are separate concerns.
- Academic AI grading returns authenticated NDJSON progress and terminal result/error events; keep long hosted responses active without artificial generation deadlines or automatic billed retries.