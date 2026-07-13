/**
 * Billing / Subscription module for Nexus.
 * Integrates with Stripe to manage subscription tiers.
 * Gracefully handles missing STRIPE_SECRET_KEY.
 */
import { createServerFn } from "@tanstack/react-start";

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  priceId?: string;
}

export interface BillingInfo {
  plan: Plan | null;
  status: "active" | "trialing" | "past_due" | "canceled" | "incomplete" | null;
  currentPeriodEnd: string | null;
  stripeEnabled: boolean;
  stripeMessage?: string;
}

export interface CheckoutResult {
  ok: boolean;
  url?: string;
  error?: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter", name: "Starter", price: 29,
    description: "Perfect for getting started.",
    features: ["Up to 5 active integrations", "10 automated workflows", "Basic support"],
  },
  {
    id: "nonprofit", name: "Non-Profit", price: 14,
    description: "For verified 501(c)(3) organizations.",
    features: ["Up to 10 active integrations", "100 automated workflows", "Requires 501(c)(3) verification"],
  },
  {
    id: "pro", name: "Pro", price: 79,
    description: "For growing businesses.",
    features: ["Unlimited integrations", "100 automated workflows", "Priority support", "Custom webhooks"],
    highlighted: true,
  },
  {
    id: "enterprise", name: "Enterprise", price: 0,
    description: "Custom plan for large teams.",
    features: ["Everything in Pro", "Dedicated support", "Custom SLAs", "On-premise option"],
  },
];

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    const Stripe = require("stripe");
    return new Stripe(key, { apiVersion: "2025-02-24.acacia" as any });
  } catch { return null; }
}

export const getPlans = createServerFn({ method: "GET" }).handler(async (): Promise<Plan[]> => PLANS);

export const getBillingInfo = createServerFn({ method: "GET" }).handler(async (): Promise<BillingInfo> => {
  const stripe = getStripe();
  if (!stripe) return { plan: PLANS[0], status: "active", currentPeriodEnd: null, stripeEnabled: false, stripeMessage: "Billing not configured. Add STRIPE_SECRET_KEY." };
  try {
    const { getCurrentUser } = await import("~/lib/auth");
    const user = await getCurrentUser();
    if (!user) return { plan: PLANS[0], status: null, currentPeriodEnd: null, stripeEnabled: true };
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (!customers.data.length) return { plan: PLANS[0], status: null, currentPeriodEnd: null, stripeEnabled: true };
    const subscriptions = await stripe.subscriptions.list({ customer: customers.data[0].id, limit: 1, status: "all" });
    if (!subscriptions.data.length) return { plan: PLANS[0], status: null, currentPeriodEnd: null, stripeEnabled: true };
    const sub = subscriptions.data[0];
    const priceId = sub.items.data[0]?.price?.id;
    const plan = priceId ? PLANS.find((p) => p.priceId === priceId) ?? PLANS[0] : PLANS[0];
    return { plan, status: sub.status as BillingInfo["status"], currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null, stripeEnabled: true };
  } catch (err: any) {
    return { plan: PLANS[0], status: null, currentPeriodEnd: null, stripeEnabled: false, stripeMessage: `Billing error: ${err.message}` };
  }
});

export const createCheckoutSession = createServerFn({ method: "POST" }).handler(async (data: unknown): Promise<CheckoutResult> => {
  const { planId } = data as { planId: string };
  const stripe = getStripe();
  if (!stripe) return { ok: false, error: "Billing not configured. Add STRIPE_SECRET_KEY." };
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) return { ok: false, error: "Invalid plan." };
  if (!plan.priceId) return { ok: false, error: "This plan has no price configured." };
  try {
    const { getCurrentUser } = await import("~/lib/auth");
    const user = await getCurrentUser();
    if (!user) return { ok: false, error: "Please log in first." };
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string;
    if (customers.data.length) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
      customerId = customer.id;
    }
    const baseUrl = process.env.PUBLIC_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId, mode: "subscription",
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard/settings?billing=success`,
      cancel_url: `${baseUrl}/dashboard/settings?billing=canceled`,
    });
    return { ok: true, url: session.url ?? undefined };
  } catch (err: any) { return { ok: false, error: err.message }; }
});

export const getPortalSession = createServerFn({ method: "POST" }).handler(async (): Promise<{ ok: boolean; url?: string; error?: string }> => {
  const stripe = getStripe();
  if (!stripe) return { ok: false, error: "Billing not configured." };
  try {
    const { getCurrentUser } = await import("~/lib/auth");
    const user = await getCurrentUser();
    if (!user) return { ok: false, error: "Please log in." };
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (!customers.data.length) return { ok: false, error: "No billing account found." };
    const baseUrl = process.env.PUBLIC_URL || "http://localhost:3000";
    const portal = await stripe.billingPortal.sessions.create({ customer: customers.data[0].id, return_url: `${baseUrl}/dashboard/settings` });
    return { ok: true, url: portal.url };
  } catch (err: any) { return { ok: false, error: err.message }; }
});