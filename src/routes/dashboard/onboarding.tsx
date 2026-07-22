import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import DashboardLayout from "~/components/dashboard-layout";
import { useToast } from "~/components/toast";
import { getConnectors, listIntegrations, createIntegration } from "~/lib/integration-api";
import { listWorkflows, createWorkflow } from "~/lib/workflow-api";
import type { ConnectorInfo } from "~/lib/integration-api";

export const Route = createFileRoute("/dashboard/onboarding")({
  component: OnboardingPage,
});

type Step = "welcome" | "connect" | "workflow" | "done";

function OnboardingPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [step, setStep] = useState<Step>("welcome");
  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [ints, wfs] = await Promise.all([listIntegrations(), listWorkflows()]);
        if (ints.ok && ints.data?.integrations.length && wfs.ok && wfs.data?.workflows.length) {
          navigate({ to: "/dashboard" });
          return;
        }
      } catch { /* proceed */ }
      setLoading(false);
    })();
  }, [navigate]);

  useEffect(() => { if (step === "connect") getConnectors().then(setConnectors).catch(() => {}); }, [step]);

  const handleConnectIntegration = async (providerId: string) => {
    addToast(`Connecting to ${providerId}…`, "info");
    try {
      const result = await createIntegration({ providerId });
      if (result.ok) { addToast("Integration connected! Now let's create a workflow.", "success"); setStep("workflow"); }
      else addToast(result.error ?? "Failed to connect.", "error");
    } catch { addToast("Connection failed.", "error"); }
  };

  const handleSkipIntegration = () => { addToast("You can connect integrations later.", "info"); setStep("workflow"); };

  const handleCreateWorkflow = async () => {
    addToast("Creating sample workflow…", "info");
    try {
      const result = await createWorkflow({ name: "My first workflow", description: "Sample workflow created during onboarding", triggerType: "manual", triggerConfig: {}, actions: [] });
      if (result.ok) { addToast("Workflow created! Ready to go.", "success"); setStep("done"); }
      else addToast(result.error ?? "Failed to create workflow.", "error");
    } catch { addToast("Failed to create workflow.", "error"); }
  };

  const handleSkipWorkflow = () => { addToast("You can create workflows later.", "info"); setStep("done"); };
  const handleFinish = () => { navigate({ to: "/dashboard" }); };

  if (loading) {
    return (
      <DashboardLayout currentPath="overview">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-warm-500">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading…
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPath="overview">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-center justify-center gap-2">
          {(["welcome", "connect", "workflow", "done"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step === s ? "bg-rose-gold-600 text-white" : ["connect", "workflow", "done"].indexOf(s) <= ["connect", "workflow", "done"].indexOf(step) ? "bg-blush-100 text-rose-gold-700 dark:bg-rose-gold-900 dark:text-blush-200" : "bg-cream-100 text-warm-400 dark:bg-cream-50"}`}>
                {["connect", "workflow", "done"].indexOf(s) <= ["connect", "workflow", "done"].indexOf(step) && step !== s ? "✓" : i + 1}
              </div>
              {i < 3 && <div className={`h-0.5 w-8 ${["connect", "workflow", "done"].indexOf(s) < ["connect", "workflow", "done"].indexOf(step) ? "bg-rose-gold-500" : "bg-warm-200 dark:bg-cream-50"}`} />}
            </div>
          ))}
        </div>

        {step === "welcome" && (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blush-100 dark:bg-rose-gold-900">
              <svg className="h-8 w-8 text-rose-gold-600 dark:text-rose-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold">Welcome to LoomLink!</h1>
            <p className="mt-3 text-lg text-warm-600 dark:text-warm-600">Let&apos;s get you set up in 3 quick steps.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[{ n: "1", t: "Connect", d: "Link your first tool" }, { n: "2", t: "Create", d: "Build your first workflow" }, { n: "3", t: "Run", d: "Your automation runs on autopilot" }].map((item) => (
                <div key={item.n} className="rounded-xl border border-warm-200 p-4 text-left dark:border-cream-200">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blush-100 text-xs font-bold text-rose-gold-700 dark:bg-rose-gold-900 dark:text-blush-200">{item.n}</span>
                  <h3 className="mt-3 font-semibold">{item.t}</h3>
                  <p className="mt-1 text-xs text-warm-500">{item.d}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep("connect")} className="mt-8 rounded-lg bg-rose-gold-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-gold-500">Get started →</button>
          </div>
        )}

        {step === "connect" && (
          <div>
            <h2 className="text-2xl font-bold">Connect your first integration</h2>
            <p className="mt-2 text-warm-600 dark:text-warm-600">Pick a service to connect.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {connectors.slice(0, 4).map((connector) => (
                <button key={connector.id} onClick={() => handleConnectIntegration(connector.id)} className="rounded-xl border border-warm-200 p-4 text-left transition-colors hover:border-rose-gold-300 hover:bg-blush-50 dark:border-cream-200 dark:hover:border-rose-gold-700 dark:hover:bg-rose-gold-950">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-100 text-lg dark:bg-cream-50">{connector.icon}</span>
                    <div><h3 className="font-semibold">{connector.name}</h3><p className="text-xs text-warm-500">{connector.authType === "api_key" ? "API Key" : "OAuth"}</p></div>
                  </div>
                  <p className="mt-2 text-xs text-warm-600 dark:text-warm-600">{connector.description}</p>
                </button>
              ))}
            </div>
            <button onClick={handleSkipIntegration} className="mt-4 text-sm text-warm-500 hover:text-warm-700 dark:hover:text-warm-300">Skip for now</button>
          </div>
        )}

        {step === "workflow" && (
          <div>
            <h2 className="text-2xl font-bold">Create your first workflow</h2>
            <p className="mt-2 text-warm-600 dark:text-warm-600">We&apos;ll create a simple one to start.</p>
            <div className="mt-6 rounded-xl border border-warm-200 p-6 dark:border-cream-200">
              <h3 className="font-semibold">Sample: "My first workflow"</h3>
              <ul className="mt-3 space-y-2 text-sm text-warm-600 dark:text-warm-600">
                <li className="flex items-center gap-2">🔧 Trigger type: Manual (run on demand)</li>
                <li className="flex items-center gap-2">📋 Actions: None yet (add them later)</li>
                <li className="flex items-center gap-2">✅ Created but disabled until you enable it</li>
              </ul>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleCreateWorkflow} className="rounded-lg bg-rose-gold-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-gold-500">Create workflow →</button>
              <button onClick={handleSkipWorkflow} className="text-sm text-warm-500 hover:text-warm-700 dark:hover:text-warm-300">Skip for now</button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900">
              <svg className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold">You&apos;re all set!</h1>
            <p className="mt-3 text-lg text-warm-600 dark:text-warm-600">Your LoomLink account is ready to go.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <a href="/dashboard/integrations" className="rounded-xl border border-warm-200 p-4 text-left transition-colors hover:border-rose-gold-300 dark:border-cream-200 dark:hover:border-rose-gold-700">
                <h3 className="font-semibold">More integrations</h3><p className="mt-1 text-xs text-warm-500">Connect additional tools</p>
              </a>
              <a href="/dashboard/workflows/new" className="rounded-xl border border-warm-200 p-4 text-left transition-colors hover:border-rose-gold-300 dark:border-cream-200 dark:hover:border-rose-gold-700">
                <h3 className="font-semibold">Build workflows</h3><p className="mt-1 text-xs text-warm-500">Create multi-step automations</p>
              </a>
              <a href="/docs" className="rounded-xl border border-warm-200 p-4 text-left transition-colors hover:border-rose-gold-300 dark:border-cream-200 dark:hover:border-rose-gold-700">
                <h3 className="font-semibold">Read the docs</h3><p className="mt-1 text-xs text-warm-500">Learn about templates & cron</p>
              </a>
            </div>
            <button onClick={handleFinish} className="mt-8 rounded-lg bg-rose-gold-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-gold-500">Go to dashboard →</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}