# EnneadTab-ARVR

> **Before changing app behavior, read `MENTAL-MODEL.md`.** Do not deviate from the Core happy path except per its governance rule (an approved exception logged there, or a deliberate happy-path update written into it).

## Quick Start
- Run dev: `npm run dev`
- Run build: `npm run build`
- Run lint: `npm run lint`

## Architecture & Surface
- Pure-web Next.js application served at repo root under `basePath: '/arvr'`.
- Proxied by `EnneadTab-Home` at `https://enneadtab.com/arvr`.
- Uses `<model-viewer>` for WebGL desktop turntable and native AR Quick Look (iOS) / SceneViewer & WebXR (Android).
- Ephemeral in-memory sessions with 2-hour TTL for 3D model streams.
- 2D Arcade visual register (CRT scanlines, Google Fonts `Press Start 2P` + `VT323`, 8-bit Web Audio synth).
- Interactive 4-stage onboarding sequence via `<OnboardingModal />`.
