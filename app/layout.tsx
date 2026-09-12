import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EnneadTab AR/VR | Mobile Camera 3D Overlay',
  description: 'Instantly view Rhino and Revit 3D models overlaid in real space via phone camera AR without installing apps.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
          async
        />
      </head>
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-teal-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}