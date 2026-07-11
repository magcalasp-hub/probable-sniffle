import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Activity</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Workflow run history and logs.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">
          No activity to show yet. Workflow runs will appear here once you
          create and enable workflows.
        </p>
      </div>
    </div>
  );
}