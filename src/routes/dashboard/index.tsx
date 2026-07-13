import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import DashboardLayout from "~/components/dashboard-layout";
import { listIntegrations } from "~/lib/integration-api";
import { listWorkflows } from "~/lib/workflow-api";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

function DashboardOverview() {
  const [integrationCount, setIntegrationCount] = useState(0);
  const [workflowCount, setWorkflowCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [ints, wfs] = await Promise.all([listIntegrations(), listWorkflows()]);
        if (ints.ok) setIntegrationCount(ints.data?.integrations.length ?? 0);
        if (wfs.ok) setWorkflowCount(wfs.data?.workflows.length ?? 0);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const isNewUser = !loading && integrationCount === 0 && workflowCount === 0;

  return (
    <DashboardLayout currentPath="overview">
      <div className="p-6 sm:p-8">
        {isNewUser && (
          <div className="mb-8 overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 dark:border-indigo-800 dark:from-indigo-950 dark:to-purple-950">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 sm:items-center">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 sm:flex dark:bg-indigo-900">
                  <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">Welcome to Nexus! 🚀</h2>
                  <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">Get started with a 3-step guided setup. Connect your first integration, create a workflow, and start automating in minutes.</p>
                </div>
                <a href="/dashboard/onboarding" className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                  Get started
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid border-t border-indigo-200 dark:border-indigo-800 sm:grid-cols-3">
              <div className="border-b border-indigo-200 p-4 text-center sm:border-b-0 sm:border-r dark:border-indigo-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Step 1</span>
                <p className="mt-1 text-sm font-medium text-indigo-900 dark:text-indigo-100">Connect an integration</p>
              </div>
              <div className="border-b border-indigo-200 p-4 text-center sm:border-b-0 sm:border-r dark:border-indigo-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Step 2</span>
                <p className="mt-1 text-sm font-medium text-indigo-900 dark:text-indigo-100">Create a workflow</p>
              </div>
              <div className="p-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Step 3</span>
                <p className="mt-1 text-sm font-medium text-indigo-900 dark:text-indigo-100">Run on autopilot</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Overview of your Nexus automations.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Integrations", value: loading ? "…" : String(integrationCount), change: integrationCount === 0 ? "Connect your first" : "Connected" },
            { label: "Workflows", value: loading ? "…" : String(workflowCount), change: workflowCount === 0 ? "Create a workflow" : "Created" },
            { label: "Runs Today", value: "0", change: "No runs yet" },
            { label: "Plan", value: "Starter", change: "Free tier" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <a href="/dashboard/integrations" className="rounded-xl border border-gray-200 p-6 transition-colors hover:border-indigo-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-indigo-700">
              <h3 className="font-semibold">Connect an integration</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Link Stripe, Gmail, Slack, and more to get started.</p>
            </a>
            <a href="/dashboard/workflows" className="rounded-xl border border-gray-200 p-6 transition-colors hover:border-indigo-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-indigo-700">
              <h3 className="font-semibold">Create a workflow</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Build your first automation to save time.</p>
            </a>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">{isNewUser ? "Welcome! Start by connecting your first integration." : "No activity yet. Create and run a workflow to see results here."}</p>
            <a href="/dashboard/integrations" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline">Browse integrations →</a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}