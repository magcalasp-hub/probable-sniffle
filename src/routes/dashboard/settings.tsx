import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import DashboardLayout from "~/components/dashboard-layout";
import { useToast } from "~/components/toast";
import { getBillingInfo, createCheckoutSession, getPortalSession, getPlans } from "~/lib/billing";
import type { BillingInfo, Plan } from "~/lib/billing";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { addToast } = useToast();
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [b, p] = await Promise.all([getBillingInfo(), getPlans()]);
        setBilling(b);
        setPlans(p);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const handleUpgrade = async (planId: string) => {
    setCheckoutLoading(planId);
    try {
      const result = await createCheckoutSession({ planId });
      if (result.ok && result.url) window.location.href = result.url;
      else addToast(result.error ?? "Failed to start checkout.", "error");
    } catch { addToast("Failed to connect to billing service.", "error"); }
    setCheckoutLoading(null);
  };

  const handlePortal = async () => {
    try {
      const result = await getPortalSession();
      if (result.ok && result.url) window.location.href = result.url;
      else addToast(result.error ?? "Failed to open billing portal.", "error");
    } catch { addToast("Failed to connect to billing service.", "error"); }
  };

  const currentPlan = billing?.plan;

  return (
    <DashboardLayout currentPath="settings">
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="mt-1 text-sm text-warm-600 dark:text-warm-600">Manage your account and billing.</p>
        </div>

        {billing && !billing.stripeEnabled && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
            <strong>⚠ Billing not configured.</strong> {billing.stripeMessage ?? "Add STRIPE_SECRET_KEY to enable subscriptions."}
          </div>
        )}

        <div className="space-y-8">
          <section className="rounded-xl border border-warm-200 p-6 dark:border-cream-200">
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="mt-1 text-sm text-warm-600 dark:text-warm-600">Your account information.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 dark:text-warm-700">Name</label>
                <input type="text" disabled className="mt-1 block w-full max-w-sm rounded-lg border border-warm-300 px-3 py-2 text-sm dark:border-cream-200 dark:bg-cream-50" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 dark:text-warm-700">Email</label>
                <input type="email" disabled className="mt-1 block w-full max-w-sm rounded-lg border border-warm-300 px-3 py-2 text-sm dark:border-cream-200 dark:bg-cream-50" placeholder="you@example.com" />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-warm-200 p-6 dark:border-cream-200">
            <h2 className="text-lg font-semibold">Plan</h2>
            {loading ? (
              <p className="mt-2 text-sm text-warm-500">Loading billing info…</p>
            ) : currentPlan ? (
              <div className="mt-2">
                <p className="text-sm text-warm-600 dark:text-warm-600">You&apos;re on the <strong>{currentPlan.name}</strong> plan{currentPlan.price > 0 && ` ($${currentPlan.price}/mo)`}.</p>
                {billing?.currentPeriodEnd && <p className="mt-1 text-xs text-warm-500">Current period ends: {new Date(billing.currentPeriodEnd).toLocaleDateString()}</p>}
                {billing?.status && billing.status !== "active" && <p className="mt-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">Status: {billing.status}</p>}
              </div>
            ) : <p className="mt-2 text-sm text-warm-500">No plan selected.</p>}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {plans.map((plan) => {
                const isCurrent = plan.id === currentPlan?.id;
                return (
                  <div key={plan.id} className={`rounded-lg border p-4 ${isCurrent ? "border-rose-gold-500 bg-blush-50 dark:border-rose-gold-600 dark:bg-rose-gold-950" : "border-warm-200 dark:border-cream-200"}`}>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-2xl font-bold">{plan.price > 0 ? `$${plan.price}` : "Custom"}<span className="text-sm font-normal text-warm-500">{plan.price > 0 ? "/mo" : ""}</span></p>
                    <ul className="mt-3 space-y-1 text-xs text-warm-600 dark:text-warm-600">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-1">
                          <svg className="h-3 w-3 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <span className="mt-3 inline-block rounded-md bg-blush-100 px-3 py-1.5 text-xs font-medium text-rose-gold-700 dark:bg-rose-gold-800 dark:text-blush-200">Current plan</span>
                    ) : plan.price > 0 ? (
                      <button onClick={() => handleUpgrade(plan.id)} disabled={checkoutLoading === plan.id} className="mt-3 inline-block w-full rounded-lg bg-rose-gold-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-gold-500 disabled:opacity-50">
                        {checkoutLoading === plan.id ? "Loading…" : "Upgrade"}
                      </button>
                    ) : (
                      <a href="/pricing" className="mt-3 inline-block w-full rounded-lg border border-rose-gold-600 px-3 py-1.5 text-center text-xs font-semibold text-rose-gold-600 hover:bg-blush-50 dark:hover:bg-rose-gold-950">Contact us</a>
                    )}
                  </div>
                );
              })}
            </div>

            {billing?.stripeEnabled && (
              <button onClick={handlePortal} className="mt-4 text-sm font-medium text-rose-gold-600 hover:underline dark:text-rose-gold-400">
                Manage billing & subscription →
              </button>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}