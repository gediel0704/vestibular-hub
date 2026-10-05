# Project Architecture Rules

- Keep the academic React/Vite/JavaScript delivery isolated under `deliverables/aprovest-react-js`; the main TanStack product must not import from it.
- The academic app must render a visible configuration or runtime error screen instead of failing to a blank page, so local setup problems remain diagnosable.
- Keep the academic app's public cloud endpoint and publishable key as built-in defaults, with environment variables as optional overrides, so the delivery runs on a clean machine.