import {
  HeadContent,
  Outlet,
  createRootRoute,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { createServerFn } from "@tanstack/react-start";
import { getCurrentUser, createClearSessionCookie } from "~/lib/auth";

const getDashboardUser = createServerFn({ method: "GET" }).handler(
  async () => {
    // This runs in SSR context; the Request is available via the event
    return null;
  },
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dashboard — Nexus" },
    ],
  }),
  component: DashboardLayout,
});

const navItems = [
  {
    section: "Main",
    items: [
      { label: "Overview", href: "/dashboard", icon: "grid" },
      { label: "Integrations", href: "/dashboard/integrations", icon: "puzzle" },
      { label: "Workflows", href: "/dashboard/workflows", icon: "play" },
      { label: "Activity", href: "/dashboard/activity", icon: "clock" },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: "cog" },
    ],
  },
];

function DashboardLayout() {
  const router = useRouter();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex min-h-dvh">
          {/* Sidebar */}
          <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 lg:flex lg:flex-col dark:border-gray-800 dark:bg-gray-900">
            <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6 dark:border-gray-800">
              <a href="/dashboard" className="text-xl font-bold text-indigo-600">
                Nexus
              </a>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              {navItems.map((group) => (
                <div key={group.section} className="mb-8">
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {group.section}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = router.state.location.pathname === item.href;
                      return (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                              isActive
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                            }`}
                          >
                            <DashboardIcon name={item.icon} />
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <form
                action="/api/auth/logout"
                method="POST"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/";
                }}
              >
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  <DashboardIcon name="logout" />
                  Log out
                </button>
              </form>
            </div>
          </aside>

          {/* Mobile header + content */}
          <div className="flex flex-1 flex-col">
            {/* Mobile top bar */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 lg:hidden dark:border-gray-800">
              <a href="/dashboard" className="text-xl font-bold text-indigo-600">
                Nexus
              </a>
              <MobileMenu />
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>

        <Scripts />
      </body>
    </html>
  );
}

function DashboardIcon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    grid: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    puzzle: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
    ),
    play: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    ),
    clock: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    cog: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    logout: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
    ),
  };
  return icons[name] ?? null;
}

function MobileMenu() {
  const router = useRouter();

  return (
    <details className="relative">
      <summary className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </summary>
      <div className="absolute right-0 top-full z-50 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        {navItems.map((group) => (
          <div key={group.section} className="mb-2">
            <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {group.section}
            </p>
            {group.items.map((item) => {
              const isActive = router.state.location.pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <DashboardIcon name={item.icon} />
                  {item.label}
                </a>
              );
            })}
          </div>
        ))}
        <div className="border-t border-gray-200 pt-2 dark:border-gray-800">
          <form
            action="/api/auth/logout"
            method="POST"
            onSubmit={async (e) => {
              e.preventDefault();
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/";
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <DashboardIcon name="logout" />
              Log out
            </button>
          </form>
        </div>
      </div>
    </details>
  );
}