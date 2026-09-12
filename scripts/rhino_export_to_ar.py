"""
EnneadTab AR/VR - Rhino 1-Click Export to Mobile AR
Exports selected geometry as GLTF/GLB and uploads to an active AR session.
"""

import os
import sys
import tempfile
import webbrowser

try:
    import rhinoscriptsyntax as rs
    import scriptcontext as sc
    import Rhino
except ImportError:
    rs = None

def export_selected_to_ar():
    if not rs:
        print("This script must be executed inside Rhino 7 or 8.")
        return

    # 1. Check selection
    objs = rs.SelectedObjects()
    if not objs:
        objs = rs.GetObjects("Select geometry/massing to view in AR", preselect=True)
        if not objs:
            print("No objects selected. Aborted.")
            return

    # 2. Prepare temporary GLB export path
    temp_dir = tempfile.gettempdir()
    doc_name = rs.DocumentName() or "RhinoModel"
    base_name = os.path.splitext(doc_name)[0]
    out_glb = os.path.join(temp_dir, "{}_AR.glb".format(base_name))

    if os.path.exists(out_glb):
        try:
            os.remove(out_glb)
        except Exception:
            pass

    # 3. Trigger Rhino GLB export command
    # Rhino 7/8 supports glTF / GLB export
    cmd = '-_Export "{}" _Enter _Enter'.format(out_glb)
    rs.Command(cmd, echo=False)

    if not os.path.exists(out_glb):
        rs.MessageBox(
            "GLB Export failed. Ensure Rhino glTF plugin is enabled or export manually to .glb.",
            0,
            "EnneadTab AR"
        )
        return

    file_size_mb = os.path.getsize(out_glb) / (1024.0 * 1024.0)
    print("Exported GLB: {} ({:.2f} MB)".format(out_glb, file_size_mb))

    # 4. Open EnneadTab-ARVR hub in browser
    hub_url = "http://localhost:3000"
    webbrowser.open(hub_url)

    rs.MessageBox(
        "Successfully exported model to:\n{}\n\nDrag and drop this file into EnneadTab-ARVR to scan and view on your phone!".format(out_glb),
        64,
        "EnneadTab AR/VR Export Ready"
    )

if __name__ == "__main__":
    export_selected_to_ar()