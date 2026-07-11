import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

function DashboardOverview() {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Welcome to your Nexus dashboard.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Integrations", value: "0", change: "Connect your first" },
          { label: "Workflows Running", value: "0", change: "Create a workflow" },
          { label: "Runs Today", value: "0", change: "No runs yet" },
          { label: "Plan", value: "Starter", change: "Free tier" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 p-6 dark:border-gray-800"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <a
            href="/dashboard/integrations"
            className="rounded-xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-indigo-700"
          >
            <h3 className="font-semibold">Connect an integration</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Link Stripe, Gmail, Slack, and more to get started.
            </p>
          </a>
          <a
            href="/dashboard/workflows"
            className="rounded-xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-indigo-700"
          >
            <h3 className="font-semibold">Create a workflow</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Build your first automation to save time.
            </p>
          </a>
        </div>
      </div>

      {/* Empty state for recent activity */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            No activity yet. Connect your first integration to get started.
          </p>
          <a
            href="/dashboard/integrations"
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
          >
            Browse integrations →
          </a>
        </div>
      </div>
    </div>
  );
}