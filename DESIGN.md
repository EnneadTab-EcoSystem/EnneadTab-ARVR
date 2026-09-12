# EnneadTab-ARVR — Visual & Interaction Design Contract

## Visual Register & Philosophy: Spatial Precision Dark
- **Dark Architectural Canvas**: `#090d16` deep background with `#14b8a6` teal spatial highlights and `#334155` slate borders. Designed to reduce screen glare in bright field/jobsite environments.
- **Typography**: Crisp modern sans (`Inter` / system UI) with monospaced telemetry headers (`font-mono` tracking session room IDs, triangle counts, and scale ratios).
- **Physical Depth**: Subtle gradients, clean glassmorphic HUD controls (`backdrop-blur-md bg-slate-900/80`), and high-contrast tactile pill buttons for sunlight visibility.

## Surface Architecture

### Desktop Hub (`/arvr`)
- **Header Telemetry**: Status badge (`WEBAR // ZERO-INSTALL`), active room ID pill with live ping pulse, and direct cross-link to EnneadTab Home.
- **Tri-column Geometry Workflow**:
  - **Left (Ingestion & Presets)**: Drag-and-drop dropzone for `.glb` / `.gltf` models + curated 1-click architectural presets (Pavilion, Spatial Anchor, Lantern) + Rhino/Revit export guidance.
  - **Center (Interactive 3D Viewport)**: Embedded `<model-viewer>` canvas with orbit, pan, auto-rotate turntable toggle, and shadow casting.
  - **Right (Mobile Bridge)**: High-contrast pairing QR code generated via `qrcode.react`, copyable direct URL, and test-in-new-tab trigger.
- **Fleet Attribution Footer**: Canonical six elements connecting EnneadTab-ARVR to the EnneadTab fleet index and wiki feedback.

### Mobile Camera AR View (`/arvr/view/[roomId]`)
- **Fullscreen Viewport**: Edge-to-edge camera passthrough using Apple AR Quick Look on iOS and Google SceneViewer / WebXR on Android.
- **Tactile AR Activation Pill**: Centered floating gradient pill button (`VIEW IN YOUR SPACE (AR)`) with double-haptic confirmation.
- **Spatial HUD Controls**:
  - **Scale Toggle**: Instant switch between `1:1 Site Scale` (real-world walkaround) and `Tabletop Mode` (1:20 miniature massing).
  - **Camera Reset**: Single tap to re-center turntable orbit.
  - **Sun Exposure Dial**: Toggles sunlight intensity (`0.7` to `1.5`) to match ambient indoor office or bright outdoor sky.
  - **Guidance Modal**: Quick 4-step onboarding overlay explaining surface detection and plane anchoring.