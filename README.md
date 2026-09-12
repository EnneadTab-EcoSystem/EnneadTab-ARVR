# EnneadTab-ARVR

> **Zero-Install Mobile Camera AR Overlay for Rhino & Revit 3D Architectural Models**

EnneadTab-ARVR bridges architectural desktop authoring with mobile augmented reality. Architects can upload or beam 3D models from Rhino / Revit to a desktop pairing hub, scan a generated QR code with any smartphone camera (iOS or Android), and immediately view and walk around the 3D model anchored in physical space with realistic lighting, shadows, and true scale.

---

## Key Features

- **Zero Mobile App Installation**: No App Store downloads, TestFlight, or sign-in barriers. Runs directly in Mobile Safari (Apple AR Quick Look) and Android Chrome (Google SceneViewer / WebXR).
- **Instant QR Pairing**: Dynamic session QR code connects desktop to mobile instantly.
- **Surface & Plane Detection**: Automatically anchors models to floors, conference tables, or outdoor ground.
- **Dual Scale Modes**:
  - `1:1 Site Scale`: Full-scale walk-around mode for physical site visits and spatial validation.
  - `Tabletop Mode`: Miniature massing scale (1:20) for team reviews and client desk presentations.
- **Ephemeral & Private**: Geometry payloads are held in temporary memory sessions (2-hour TTL) with zero persistent cloud archiving.
- **Rhino & Revit Friendly**: Centered on Khronos Group glTF/GLB standard with sample presets and 1-click Rhino export utility.

---

## Quick Start

### Installation
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your desktop browser.

### Usage
1. Drag and drop any `.glb` or `.gltf` file onto the dropzone (or select an instant architectural sample).
2. Point your smartphone camera at the dynamic QR code on screen.
3. Tap the link to open the mobile viewer.
4. Tap **"VIEW IN YOUR SPACE (AR)"** to activate the camera and place the model!

---

## License & Attribution
Part of the **EnneadTab** ecosystem by Sen Zhang for Ennead Architects.