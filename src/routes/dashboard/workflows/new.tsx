import { createFileRoute } from "@tanstack/react-router";
import DashboardLayout from "~/components/dashboard-layout";
import { useState } from "react";
import { createWorkflow } from "~/lib/workflow-api";
import { getConnectors } from "~/lib/integration-api";
import type { ActionStep, TriggerType } from "~/engine";
import type { ConnectorInfo } from "~/lib/integration-api";

export const Route = createFileRoute("/dashboard/workflows/new")({
  component: NewWorkflowPage,
});

function NewWorkflowPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState<TriggerType>("manual");
  const [cronExpr, setCronExpr] = useState("0 */6 * * *");
  const [actions, setActions] = useState<ActionStep[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStepProvider, setNewStepProvider] = useState("");
  const [newStepOperation, setNewStepOperation] = useState("");
  const [newStepLabel, setNewStepLabel] = useState("");

  // Load connectors for the action builder
  useState(() => {
    getConnectors().then(setConnectors).catch(() => {});
  });

  const operationsForProvider = connectors.find(
    (c) => c.id === newStepProvider,
  )?.operations;

  function addStep() {
    const stepId = `step_${actions.length + 1}`;
    setActions((prev) => [
      ...prev,
      {
        id: stepId,
        providerId: newStepProvider,
        operationId: newStepOperation,
        params: {},
        label: newStepLabel || `${newStepProvider}: ${newStepOperation}`,
        outputVar: stepId,
      },
    ]);
    setNewStepProvider("");
    setNewStepOperation("");
    setNewStepLabel("");
    setShowAddStep(false);
  }

  function removeStep(id: string) {
    setActions((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const result = await createWorkflow({
        name: name.trim(),
        description: description.trim() || undefined,
        triggerType,
        triggerConfig:
          triggerType === "schedule" ? { cron: cronExpr } : undefined,
        actions,
      });
      if (result.ok) setSaved(true);
    } catch {}
    setSaving(false);
  }

  if (saved) {
    return (
      <DashboardLayout currentPath="/dashboard/workflows">
        <div className="p-6 sm:p-8">
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950">
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
              Workflow created!
            </h2>
            <p className="mt-2 text-green-700 dark:text-green-300">
              Your workflow has been saved and is ready to run.
            </p>
            <a
              href="/dashboard/workflows"
              className="mt-4 inline-block rounded-lg bg-rose-gold-600 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-gold-500"
            >
              Back to workflows
            </a>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPath="/dashboard/workflows">
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">New workflow</h1>
          <p className="mt-1 text-sm text-warm-600 dark:text-warm-600">
            Create an automated workflow.
          </p>
        </div>

        <div className="max-w-2xl space-y-8">
          {/* Name */}
          <section>
            <label className="block text-sm font-medium text-warm-700 dark:text-warm-700">
              Workflow name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-warm-300 px-3 py-2 text-sm dark:border-cream-200 dark:bg-cream-50 dark:text-warm-800"
              placeholder="e.g. Daily payment reconciliation"
            />
          </section>

          {/* Description */}
          <section>
            <label className="block text-sm font-medium text-warm-700 dark:text-warm-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-lg border border-warm-300 px-3 py-2 text-sm dark:border-cream-200 dark:bg-cream-50 dark:text-warm-800"
              placeholder="What does this workflow do?"
            />
          </section>

          {/* Trigger */}
          <section>
            <h2 className="text-lg font-semibold">Trigger</h2>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {([
                { value: "manual", label: "Manual", desc: "Run on demand" },
                {
                  value: "schedule",
                  label: "Schedule",
                  desc: "Run on a timer",
                },
                {
                  value: "webhook",
                  label: "Webhook",
                  desc: "Triggered by events",
                },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTriggerType(t.value)}
                  className={`rounded-lg border p-4 text-left ${
                    triggerType === t.value
                      ? "border-rose-gold-600 ring-2 ring-rose-gold-600"
                      : "border-warm-200 dark:border-cream-200"
                  }`}
                >
                  <div className="font-medium">{t.label}</div>
                  <div className="mt-1 text-xs text-warm-500">{t.desc}</div>
                </button>
              ))}
            </div>
            {triggerType === "schedule" && (
              <div className="mt-3">
                <label className="block text-sm text-warm-600 dark:text-warm-600">
                  Cron expression
                </label>
                <input
                  type="text"
                  value={cronExpr}
                  onChange={(e) => setCronExpr(e.target.value)}
                  className="mt-1 block w-full max-w-xs rounded-lg border border-warm-300 px-3 py-2 text-sm font-mono dark:border-cream-200 dark:bg-cream-50"
                  placeholder="0 */6 * * *"
                />
                <p className="mt-1 text-xs text-warm-400">
                  Examples: 0 */6 * * * (every 6h), 0 9 * * 1-5 (weekdays 9am)
                </p>
              </div>
            )}
          </section>

          {/* Actions */}
          <section>
            <h2 className="text-lg font-semibold">Actions</h2>
            <p className="text-sm text-warm-500">
              Steps are executed in order. Outputs are available as
              {" "}{"{{step_name.field}}"} in later steps.
            </p>

            {actions.length === 0 && !showAddStep && (
              <div className="mt-4 rounded-lg border border-dashed border-warm-300 p-8 text-center dark:border-cream-200">
                <p className="text-sm text-warm-500">
                  No actions yet. Add your first step.
                </p>
              </div>
            )}

            {actions.length > 0 && (
              <div className="mt-4 space-y-3">
                {actions.map((step, i) => (
                  <div
                    key={step.id}
                    className="flex items-start justify-between rounded-lg border border-warm-200 p-4 dark:border-cream-200"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blush-100 text-xs font-bold text-rose-gold-700 dark:bg-rose-gold-950 dark:text-rose-gold-300">
                          {i + 1}
                        </span>
                        <span className="font-medium">
                          {step.label || `${step.providerId}: ${step.operationId}`}
                        </span>
                      </div>
                      <p className="ml-8 mt-1 text-xs text-warm-500">
                        {step.providerId} → {step.operationId}
                      </p>
                    </div>
                    <button
                      onClick={() => removeStep(step.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddStep ? (
              <div className="mt-4 rounded-lg border border-warm-200 p-4 dark:border-cream-200">
                <h3 className="mb-3 text-sm font-semibold">Add step</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-warm-600">
                      Connector
                    </label>
                    <select
                      value={newStepProvider}
                      onChange={(e) => {
                        setNewStepProvider(e.target.value);
                        setNewStepOperation("");
                      }}
                      className="mt-1 block w-full rounded-lg border border-warm-300 px-3 py-2 text-sm dark:border-cream-200 dark:bg-cream-50"
                    >
                      <option value="">Select...</option>
                      {connectors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {newStepProvider && operationsForProvider && (
                    <div>
                      <label className="block text-xs text-warm-600">
                        Operation
                      </label>
                      <select
                        value={newStepOperation}
                        onChange={(e) => setNewStepOperation(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-warm-300 px-3 py-2 text-sm dark:border-cream-200 dark:bg-cream-50"
                      >
                        <option value="">Select...</option>
                        {operationsForProvider.map((op) => (
                          <option key={op.id} value={op.id}>
                            {op.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-warm-600">
                      Label (optional)
                    </label>
                    <input
                      type="text"
                      value={newStepLabel}
                      onChange={(e) => setNewStepLabel(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-warm-300 px-3 py-2 text-sm dark:border-cream-200 dark:bg-cream-50"
                      placeholder="e.g. Send notification to #finance"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addStep}
                      disabled={!newStepProvider || !newStepOperation}
                      className="rounded-lg bg-rose-gold-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-gold-500 disabled:opacity-50"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddStep(false)}
                      className="rounded-lg border border-warm-300 px-4 py-2 text-sm font-medium dark:border-cream-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddStep(true)}
                className="mt-4 rounded-lg border border-dashed border-warm-300 px-4 py-3 text-sm font-medium text-warm-600 hover:border-warm-400 dark:border-cream-200 dark:text-warm-600"
              >
                + Add action step
              </button>
            )}
          </section>

          {/* Save */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="rounded-lg bg-rose-gold-600 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-gold-500 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save workflow"}
            </button>
            <a
              href="/dashboard/workflows"
              className="rounded-lg border border-warm-300 px-6 py-2 text-sm font-medium dark:border-cream-200"
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}