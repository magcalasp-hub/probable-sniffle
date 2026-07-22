import { createFileRoute } from "@tanstack/react-router";
import DashboardLayout from "~/components/dashboard-layout";
import { useState, useEffect } from "react";
import {
  listWorkflows,
  deleteWorkflow,
  runWorkflow,
} from "~/lib/workflow-api";
import type { WorkflowInfo } from "~/lib/workflow-api";

export const Route = createFileRoute("/dashboard/workflows")({
  component: WorkflowsPage,
});

function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const result = await listWorkflows();
      if (result.ok && result.data) setWorkflows(result.data.workflows);
    } catch {}
    setLoading(false);
  }

  async function handleRun(id: string) {
    setRunning(id);
    const result = await runWorkflow({ id });
    setRunning(null);
    if (result.ok) {
      alert("Workflow execution completed!");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this workflow?")) return;
    const result = await deleteWorkflow({ id });
    if (result.ok) setWorkflows((prev) => prev.filter((w) => w.id !== id));
  }

  const triggerLabel = (t: string) =>
    t === "schedule" ? "⏰ Scheduled" : t === "webhook" ? "🔗 Webhook" : "👆 Manual";

  return (
    <DashboardLayout currentPath="/dashboard/workflows">
      <div className="p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Workflows</h1>
            <p className="mt-1 text-sm text-warm-600 dark:text-warm-600">
              Automate your routine processes.
            </p>
          </div>
          <a
            href="/dashboard/workflows/new"
            className="rounded-lg bg-rose-gold-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-gold-500"
          >
            New workflow
          </a>
        </div>

        {loading ? (
          <p className="text-warm-500">Loading...</p>
        ) : workflows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-warm-300 p-12 text-center dark:border-cream-200">
            <p className="text-warm-600 dark:text-warm-600">
              No workflows yet. Create your first automation.
            </p>
            <a
              href="/dashboard/workflows/new"
              className="mt-4 inline-block text-sm font-medium text-rose-gold-600 hover:underline"
            >
              Create workflow →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="flex items-center justify-between rounded-lg border border-warm-200 p-4 dark:border-cream-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{wf.name}</h3>
                    <span className="text-xs text-warm-500">
                      {triggerLabel(wf.triggerType)}
                    </span>
                    {wf.enabled ? (
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    ) : (
                      <span className="inline-block h-2 w-2 rounded-full bg-warm-400" />
                    )}
                  </div>
                  {wf.description && (
                    <p className="mt-1 text-sm text-warm-500">
                      {wf.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-warm-400">
                    {wf.actions.length} step{wf.actions.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRun(wf.id)}
                    disabled={running === wf.id}
                    className="rounded-lg border border-warm-300 px-3 py-1.5 text-xs font-medium hover:bg-cream-50 disabled:opacity-50 dark:border-cream-200"
                  >
                    {running === wf.id ? "Running..." : "Run"}
                  </button>
                  <button
                    onClick={() => handleDelete(wf.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}