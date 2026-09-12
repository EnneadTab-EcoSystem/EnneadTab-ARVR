# EnneadTab-ARVR - Mental Model & Contract

## The mental model (one sentence)
This app exists so an architect can instantly beam any Rhino or Revit 3D model to their mobile phone via QR code and overlay it in physical space through the smartphone camera without downloading apps, signing in, or configuring headsets.

## The core happy path
1. **Open Desktop Hub**: Architect opens `https://enneadtab.com/arvr` (or triggers the EnneadTab Rhino/Revit export button).
2. **Load 3D Model**: The user drops in a `.glb` / `.gltf` model (or selects from instant architectural demo presets). The desktop displays an interactive 3D orbit preview and auto-generates a dynamic session QR code.
3. **Scan with Phone**: The architect points their smartphone camera at the desktop QR code, opening the zero-install mobile WebAR page (`/arvr/view/[roomId]`).
4. **Camera AR Overlay**: Tapping **"VIEW IN YOUR SPACE (AR)"** opens the device camera passthrough (Apple AR Quick Look on iOS, SceneViewer/WebXR on Android), detects surfaces (table, floor, or site), and anchors the building model with realistic lighting, shadows, and 1:1 or tabletop scaling.
5. **Client Presentation / Screenshot**: Users can walk around the model in real space and capture photo snapshots directly to their phone's camera roll.

## Success = observed
- The 3D model renders in full interactive 3D WebGL orbit on the desktop within 1 second of drop/selection.
- The dynamic QR code updates instantaneously to point to `/arvr/view/[roomId]`.
- Scanning the QR code on an iPhone (Safari) or Android (Chrome) opens the model stream with zero app-store install prompt.
- Tapping **"VIEW IN YOUR SPACE"** activates the device camera and anchors geometry onto real-world planes.
- Switching between 1:1 Site Scale and Tabletop Mode adjusts the anchored bounding box accurately.

## Invariants
- **Zero Mobile App Friction**: Runs strictly in mobile Safari / Chrome browsers via WebXR / Quick Look. Zero App Store downloads or Microsoft SSO barrier for client or site phones.
- **Ephemeral & Confidential**: Project geometries are held only within ephemeral session scope (2-hour TTL) with zero long-term storage or unauthorized indexing.
- **Format Interoperability**: Centered on Khronos glTF / GLB open standard for universal 3D web geometry delivery.
- **EnneadTab Fleet Consistency**: Unified dark aesthetic, responsive mobile typography, and cross-links to EnneadTab Home.
- **2D Arcade Visual Identity**: CRT scanlines, pixel typography (`Press Start 2P`, `VT323`), 3px solid borders, and synthesized 8-bit sound effects honoring the EnneadTab Arcade design fleet.
- **House Fleet Attribution**: Persistent footer must link to EnneadTab Home, wiki feedback, and display canonical attribution.

## Non-goals
- Full VR immersion head-mounted display coordination (handled by `EnneadTab-VR-Headset-Wiki`).
- In-browser BIM parameter editing or authoring (authored in Rhino / Revit).
- Real-time multi-person cloud avatar collaboration.

## Exceptions log
*(None yet)*

## Happy-path changelog
- 2026-09-12 - Initial golden happy path established upon service factory pure-web scaffolding - approved by Sen Zhang.
- 2026-09-12 - Transformed UI/UX to 2D Arcade visual register (CRT scanlines, Google Fonts 'Press Start 2P' / 'VT323', 8-bit Web Audio synth) and added 4-stage interactive onboarding sequence (`<OnboardingModal />`).