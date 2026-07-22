import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
});

const features = [
  {
    section: "Integrations",
    items: [
      {
        name: "Stripe",
        desc: "Connect your Stripe account to monitor payments, create invoices, reconcile transactions, and handle refunds — all automated.",
      },
      {
        name: "Gmail",
        desc: "Send automated emails, parse incoming messages, archive threads, and trigger workflows from specific email patterns.",
      },
      {
        name: "Slack",
        desc: "Post messages to channels, notify your team of events, and receive interactive workflow confirmations.",
      },
      {
        name: "Calendly",
        desc: "Detect new bookings, send reminders, follow up after meetings, and sync calendar events to other tools.",
      },
      {
        name: "Shopify",
        desc: "Monitor orders, update inventory, send fulfillment confirmations, and sync customer data to your CRM.",
      },
      {
        name: "HubSpot",
        desc: "Sync contacts, log activities, update deal stages, and trigger workflows based on CRM events.",
      },
      {
        name: "Notion",
        desc: "Create and update database entries, log workflow results, and maintain a searchable audit trail.",
      },
      {
        name: "Custom API",
        desc: "Connect any REST API with our generic webhook and HTTP request actions. BYO auth tokens.",
      },
    ],
  },
  {
    section: "Workflow Automation",
    items: [
      {
        name: "Multi-step workflows",
        desc: "Chain actions across different integrations. Example: New Stripe payment → create invoice in Gmail → notify Slack.",
      },
      {
        name: "Conditional logic",
        desc: "Add if/then branches to your workflows. Only send follow-up emails for orders over $100, for example.",
      },
      {
        name: "Template variables",
        desc: "Pass data between steps using {{variable}} syntax. Use output from one action as input to the next.",
      },
      {
        name: "Scheduled runs",
        desc: "Cron-based scheduling. Run daily reconciliations, weekly digests, hourly syncs — you pick the cadence.",
      },
    ],
  },
  {
    section: "Monitoring & Reliability",
    items: [
      {
        name: "Run history",
        desc: "Every workflow execution is logged with input, output, timing, and status. Full audit trail.",
      },
      {
        name: "Failure alerts",
        desc: "Get notified via Slack or email when a workflow fails. See the exact error and retry instantly.",
      },
      {
        name: "Usage dashboard",
        desc: "See how many workflows ran today, which integrations are most active, and your monthly trends.",
      },
    ],
  },
];

function FeaturesPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Features
          </h1>
          <p className="mt-4 text-lg text-warm-600 dark:text-warm-600">
            Everything you need to connect your tools and automate your workflows.
          </p>
        </div>

        {features.map((group) => (
          <div key={group.section} className="mt-16">
            <h2 className="text-2xl font-bold">{group.section}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-warm-200 p-6 dark:border-cream-200"
                >
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-warm-600 dark:text-warm-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-16 text-center">
          <a
            href="/signup"
            className="rounded-lg bg-rose-gold-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-rose-gold-500"
          >
            Start building with LoomLink
          </a>
        </div>
      </div>
    </div>
  );
}