import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

const sections = [
  {
    title: "Getting Started",
    items: [
      {
        name: "Quick start guide",
        desc: "Connect your first integration and build your first workflow in under 10 minutes.",
      },
      {
        name: "Supported integrations",
        desc: "Full list of supported platforms and how to connect each one.",
      },
      {
        name: "Authentication & security",
        desc: "How we handle OAuth, API keys, encryption, and data privacy.",
      },
    ],
  },
  {
    title: "Workflows",
    items: [
      {
        name: "Building workflows",
        desc: "Learn the workflow builder interface: triggers, actions, conditions, and variables.",
      },
      {
        name: "Trigger types",
        desc: "Webhooks, scheduled (cron), and manual triggers — when to use each.",
      },
      {
        name: "Action chaining",
        desc: "Pass data between steps, use template variables, and handle errors gracefully.",
      },
      {
        name: "Testing workflows",
        desc: "How to test-run a workflow before enabling it in production.",
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        name: "Stripe integration",
        desc: "Available operations: list payments, create invoices, reconcile transactions.",
      },
      {
        name: "Gmail integration",
        desc: "Available operations: send email, search inbox, archive messages.",
      },
      {
        name: "Slack integration",
        desc: "Available operations: post message, upload file, create channel.",
      },
      {
        name: "Calendly integration",
        desc: "Available operations: list events, get invitee details, send reminders.",
      },
    ],
  },
  {
    title: "API Reference",
    items: [
      {
        name: "REST API overview",
        desc: "Programmatically manage integrations, workflows, and trigger runs.",
      },
      {
        name: "Webhook events",
        desc: "Payload formats and signatures for incoming webhook events.",
      },
      {
        name: "Rate limits",
        desc: "Request limits, retry strategies, and best practices.",
      },
    ],
  },
];

function DocsPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Documentation
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Everything you need to get the most out of LoomLoop.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-indigo-600">
                {section.title}
              </h2>
              <ul className="mt-6 space-y-6">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-bold">Need help?</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Can&apos;t find what you&apos;re looking for? Reach out to our support team.
          </p>
          <a
            href="#"
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
          >
            Contact support →
          </a>
        </div>
      </div>
    </div>
  );
}