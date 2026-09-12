# EnneadTab-ARVR — Visual & Interaction Design Contract

## Visual Register & Philosophy: 2D Arcade Pixel Art
In continuity with the EnneadTab Arcade fleet (`EnneadTab-PhoneScanner`, `EnneadTab-Arcade`), **EnneadTab-ARVR** embraces an authentic, retro-futuristic **2D arcade cabinet aesthetic**. This marries high-tech spatial augmented reality with playful, tactile nostalgia:
- **CRT Phosphor Canvas**: `#0f0f1b` deep arcade black with `#181829` panel backdrops and `#313244` chunky pixel borders. Subtle overlaid CRT scanlines give the viewport a retro terminal feel.
- **Arcade Color Palette**:
  - `arcade-yellow` (`#f9e2af`): Primary coin-op action highlights, mission banners, and focus rings.
  - `arcade-cyan` (`#89dceb`): Telemetry headers, AR Quick Look triggers, and scale toggles.
  - `arcade-green` (`#a6e3a1`): System health, camera active pulse, and operational readiness badges.
  - `arcade-purple` (`#cba6f7`): Curated architectural presets and stage badges.
  - `arcade-red` (`#f38ba8`): Alerts, reset controls, and close buttons.
- **Pixel Typography**: Google Fonts `'Press Start 2P'` for punchy arcade titles, mission badges, and button labels; paired with `'VT323'` and `'Space Mono'` for monospaced spatial telemetry.
- **Tactile Physics & Pixel Shadows**: High-contrast 3px solid borders with offset pixel drop shadows (`box-shadow: 4px 4px 0px #000000`) and active depression (`active:translate-x-0.5 active:translate-y-0.5`).
- **8-Bit Web Audio Synthesizer**: Procedural square-wave sound effects via the Web Audio API (drop chime, preset select, clipboard copy) with instant mute toggle and zero-crash silent fallback on restricted browsers.

---

## Interactive 4-Stage Onboarding Sequence (`<OnboardingModal />`)
First-time architects are greeted by an arcade mission briefing that can also be reopened at any time via the `[ ? HOW TO PLAY ]` button:
1. **Stage 1: Load 3D Architectural Model** — Instructions on dropping `.glb` / `.gltf` geometry or clicking demo presets.
2. **Stage 2: Scan Dynamic QR with Phone** — Explains the zero-install mobile bridge to device camera.
3. **Stage 3: Surface Anchoring in Real Space** — Step-by-step guidance on panning camera over floors/tables to establish AR ground planes.
4. **Stage 4: Dual Scale & Sunlight Controls** — Walkaround in 1:1 true scale vs tabletop presentation review.
- Persisted locally via `localStorage.getItem('enneadtab_arvr_onboarded')`.

---

## Surface Architecture

### Desktop Hub (`/arvr`)
- **Arcade Cabinet Header**: Flashing status badge (`[● AR-OVERLAY ONLINE]`), active session telemetry, sound FX toggle (`SFX [ON/OFF]`), and quick onboarding launcher (`[? HOW TO PLAY]`).
- **Tri-column Arcade Layout**:
  - **Left (Preset & Drop Zone)**: Pixelated drop target with animated upload cues, instant 1-click model presets (Pavilion, Spatial Anchor, Lantern), and Rhino/Revit export tips.
  - **Center (3D Turntable Viewport)**: Retro terminal bezel surrounding `<model-viewer>` with interactive orbit, pan, turntable spin, and live exposure tweaks.
  - **Right (Mobile Bridge)**: Chunky pixel-framed QR code with room badge, copyable link button, and desktop preview button.
- **House Fleet Attribution Footer**: Canonical six elements connecting EnneadTab-ARVR to the EnneadTab fleet index, home, and feedback wiki.

### Mobile Camera AR View (`/arvr/view/[roomId]`)
- **Fullscreen WebAR Viewport**: Zero-install camera passthrough via Apple AR Quick Look (iOS USDZ auto-conversion) and Google SceneViewer / WebXR (Android).
- **Tactile AR Activation Button**: Slotted arcade button (`VIEW IN YOUR SPACE (AR)`) with yellow pixel borders and tactile down-press.
- **Arcade HUD Controls**:
  - **Scale Toggle**: Instant switch between `1:1 SITE SCALE` and `TABLETOP MODE`.
  - **Camera Reset**: Fast re-centering of the turntable orbit.
  - **Sun Exposure Dial**: Cycles sunlight intensity (`0.7` to `1.5`).
  - **Quick Help Overlay**: Fast 5-step modal explaining camera movement and surface detection.