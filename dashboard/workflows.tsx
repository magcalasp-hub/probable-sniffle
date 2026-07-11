import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/workflows")({
  component: WorkflowsPage,
});

function WorkflowsPage() {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflows</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Automate your routine processes.
          </p>
        </div>
        <button
          disabled
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-50"
        >
          New workflow
        </button>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">
          No workflows yet. Connect an integration first, then build your first
          workflow.
        </p>
        <a
          href="/dashboard/integrations"
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          Connect integrations →
        </a>
      </div>
    </div>
  );
}