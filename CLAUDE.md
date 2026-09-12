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

## 3-Point Ecosystem Integration (Change Across 3 Places)

When updating room endpoints, model formats, upload payloads, or URL contracts, **you must update all 3 endpoints in sync**:

1. **Web App & Ingest API (`EnneadTab-ARVR`)**:
   - Ingest Route: [`app/api/room/[roomId]/route.ts`](file:///c:/Users/szhang/github/EnneadTab-ARVR/app/api/room/[roomId]/route.ts) — handles POST binary stream / multipart upload, GET stream, and `?meta=1`.
   - Desktop Hub: [`app/page.tsx`](file:///c:/Users/szhang/github/EnneadTab-ARVR/app/page.tsx) — accepts `?room={roomId}` or `?roomId={roomId}` to preload uploaded model session.
   - Mobile AR Viewer: [`app/view/[roomId]/page.tsx`](file:///c:/Users/szhang/github/EnneadTab-ARVR/app/view/[roomId]/page.tsx) — zero-install AR camera overlay.

2. **Revit Desktop Endpoint (`EnneadTab-OS`)**:
   - Pushbutton Script: [`Apps/_revit/EnneaDuck.extension/.../arvr_overlay.pushbutton/arvr_overlay_script.py`](file:///c:/Users/szhang/github/EnneadTab-OS/Apps/_revit/EnneaDuck.extension/EnneadTab.tab/Import%20Export.panel/arvr_overlay.pushbutton/arvr_overlay_script.py)
   - WPF UI: [`ARVR_Overlay_Form.xaml`](file:///c:/Users/szhang/github/EnneadTab-OS/Apps/_revit/EnneaDuck.extension/EnneadTab.tab/Import%20Export.panel/arvr_overlay.pushbutton/ARVR_Overlay_Form.xaml)
   - Shared Library: [`Apps/lib/EnneadTab/ARVR.py`](file:///c:/Users/szhang/github/EnneadTab-OS/Apps/lib/EnneadTab/ARVR.py) (`upload_model_file`, `generate_room_id`, `open_web_hub`)

3. **Rhino Desktop Endpoint (`EnneadTab-OS`)**:
   - Toolbar Button Script: [`Apps/_rhino/Render.tab/arvr_overlay.button/arvr_overlay_left.py`](file:///c:/Users/szhang/github/EnneadTab-OS/Apps/_rhino/Render.tab/arvr_overlay.button/arvr_overlay_left.py) (uses Eto dialog and `EnneadTab.ARVR`)
   - Shared Library: [`Apps/lib/EnneadTab/ARVR.py`](file:///c:/Users/szhang/github/EnneadTab-OS/Apps/lib/EnneadTab/ARVR.py) (uses .NET WebRequest on IronPython 2.7)

*Central Relationship Edge*: Registered in `senzhang-plugin-hub:_shared/relationships/edges.json` (`EnneadTab-ARVR → EnneadTab-OS` and `EnneadTab-Home → EnneadTab-ARVR`).
