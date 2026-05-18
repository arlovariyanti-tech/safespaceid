import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";
import { InstallPrompt } from "@/components/InstallPrompt";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#a5b4fc" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "application-name", content: "SafeSpace" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "SafeSpace" },
      { title: "SafeSpace — Ruang Aman & Karakter Positif di Sekolahmu" },
      { name: "description", content: "SafeSpace — Bangun ruang aman dan karakter positif di sekolahmu. Edukasi, komunitas, dan dukungan emosional untuk remaja." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "SafeSpace — Ruang Aman di Sekolahmu" },
      { property: "og:description", content: "Bangun ruang aman dan karakter positif di sekolahmu bersama SafeSpace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "SafeSpace — Ruang Aman di Sekolahmu" },
      { name: "twitter:description", content: "Bangun ruang aman dan karakter positif di sekolahmu bersama SafeSpace." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/etZEEahDDLdNXwZIlmnK9XoUS2T2/social-images/social-1777454898804-WhatsApp_Image_2026-04-29_at_16.27.38.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/etZEEahDDLdNXwZIlmnK9XoUS2T2/social-images/social-1777454898804-WhatsApp_Image_2026-04-29_at_16.27.38.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", href: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon-192.png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/icon-512.png", sizes: "512x512" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <InstallPrompt />
      <Toaster />
    </AuthProvider>
  );
}
