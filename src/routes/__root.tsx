import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "~/styles/app.css?url";
import { ToastProvider } from "~/components/toast";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LoomLink — Integration Platform" },
      {
        name: "description",
        content:
          "Connect your business tools and automate workflows. Set it up once, it runs on autopilot.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-warm-600 dark:text-warm-600">Page not found</p>
      <a href="/" className="text-rose-gold-600 hover:underline">Go home</a>
    </div>
  ),
  component: RootComponent,
  errorComponent: ({ error }: { error: Error }) => (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-center text-warm-600 dark:text-warm-600">
        An unexpected error occurred. Please try refreshing the page.
      </p>
      {process.env.NODE_ENV !== "production" && (
        <pre className="max-w-xl overflow-auto rounded-lg bg-red-50 p-4 text-xs text-red-800 dark:bg-red-950 dark:text-red-200">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      )}
      <a href="/" className="text-rose-gold-600 hover:underline">Go home</a>
    </div>
  ),
});

function RootComponent() {
  return (
    <ToastProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ToastProvider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  );
}

function SiteHeader() {
  const year = new Date().getFullYear();
  return (
    <header className="sticky top-0 z-50 border-b border-warm-200 bg-cream/80 backdrop-blur-sm dark:border-cream-200 dark:bg-cream-50/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <a href="/" className="text-xl font-bold tracking-tight text-rose-gold-600">LoomLink</a>
          <div className="hidden items-center gap-6 md:flex">
            <a href="/features" className="text-sm font-medium text-warm-600 hover:text-warm-900 dark:text-warm-600 dark:hover:text-warm-800">Features</a>
            <a href="/pricing" className="text-sm font-medium text-warm-600 hover:text-warm-900 dark:text-warm-600 dark:hover:text-warm-800">Pricing</a>
            <a href="/docs" className="text-sm font-medium text-warm-600 hover:text-warm-900 dark:text-warm-600 dark:hover:text-warm-800">Docs</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-sm font-medium text-warm-600 hover:text-warm-900 dark:text-warm-600 dark:hover:text-warm-800">Log in</a>
          <a href="/signup" className="rounded-lg bg-rose-gold-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-gold-500">Get started</a>
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-warm-200 bg-cream-50 dark:border-cream-200 dark:bg-cream-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-warm-900 dark:text-warm-800">Product</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="/features" className="text-sm text-warm-600 hover:text-warm-900 dark:text-warm-600">Features</a></li>
              <li><a href="/pricing" className="text-sm text-warm-600 hover:text-warm-900 dark:text-warm-600">Pricing</a></li>
              <li><a href="/docs" className="text-sm text-warm-600 hover:text-warm-900 dark:text-warm-600">Docs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-warm-900 dark:text-warm-800">Integrations</h3>
            <ul className="mt-4 space-y-3">
              <li><span className="text-sm text-warm-600 dark:text-warm-600">Stripe</span></li>
              <li><span className="text-sm text-warm-600 dark:text-warm-600">Gmail</span></li>
              <li><span className="text-sm text-warm-600 dark:text-warm-600">Slack</span></li>
              <li><span className="text-sm text-warm-600 dark:text-warm-600">Calendly</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-warm-900 dark:text-warm-800">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><span className="text-sm text-warm-600 dark:text-warm-600">About</span></li>
              <li><span className="text-sm text-warm-600 dark:text-warm-600">Blog</span></li>
              <li><span className="text-sm text-warm-600 dark:text-warm-600">Contact</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-warm-900 dark:text-warm-800">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><span className="text-sm text-warm-600 dark:text-warm-600">Privacy</span></li>
              <li><span className="text-sm text-warm-600 dark:text-warm-600">Terms</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-warm-200 pt-8 dark:border-cream-200">
          <p className="text-sm text-warm-400 dark:text-warm-600">&copy; {year} LoomLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}