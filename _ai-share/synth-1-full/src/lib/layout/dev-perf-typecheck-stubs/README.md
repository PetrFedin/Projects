# dev-perf typecheck stubs

Lightweight stand-ins for lazy/dynamic import targets in provider gates.
Used only by `tsconfig.dev-perf.json` path overrides so `typecheck:dev-perf`
validates gate wiring without pulling auth, workshop2, or full provider trees.
