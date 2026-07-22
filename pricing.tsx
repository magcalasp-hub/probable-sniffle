import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    desc: "For solo founders and small teams getting started with automation.",
    features: [
      "Up to 5 active integrations",
      "50 workflow runs per day",
      "Basic workflow builder",
      "Email notifications",
      "7-day run history",
      "Community support",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    desc: "For growing businesses that need more integrations and power.",
    features: [
      "Up to 20 active integrations",
      "500 workflow runs per day",
      "Advanced workflow builder (conditions, variables)",
      "Slack + email notifications",
      "90-day run history",
      "Priority support",
      "Scheduled workflows (cron)",
      "Team collaboration (up to 5 seats)",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations with custom needs and dedicated support.",
    features: [
      "Unlimited integrations",
      "Unlimited workflow runs",
      "Custom workflow builder",
      "All notification channels",
      "Unlimited run history",
      "Dedicated support",
      "Custom SLA",
      "Unlimited team seats",
      "SSO / SAML",
      "On-premise option",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

function PricingPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Start free. Upgrade when you outgrow us.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-rose-gold-600 ring-2 ring-rose-gold-600"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {plan.desc}
              </p>
              <div className="mt-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.period}
                  </span>
                )}
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-gold-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.name === "Enterprise" ? "/contact" : "/signup"}
                className={`mt-8 block rounded-lg px-6 py-3 text-center text-sm font-semibold ${
                  plan.highlighted
                    ? "bg-rose-gold-600 text-white hover:bg-rose-gold-500"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}