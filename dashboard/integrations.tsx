import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/integrations")({
  component: IntegrationsPage,
});

const providers = [
  { id: "stripe", name: "Stripe", desc: "Payment processing & invoicing" },
  { id: "gmail", name: "Gmail", desc: "Email composition & inbox" },
  { id: "slack", name: "Slack", desc: "Team messaging & notifications" },
  { id: "calendly", name: "Calendly", desc: "Appointment scheduling" },
  { id: "shopify", name: "Shopify", desc: "E-commerce platform" },
  { id: "hubspot", name: "HubSpot", desc: "CRM & marketing automation" },
  { id: "notion", name: "Notion", desc: "Docs & knowledge base" },
];

function IntegrationsPage() {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Connect your tools to Nexus. One click to enable.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="rounded-xl border border-gray-200 p-6 hover:shadow-sm dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{provider.name}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {provider.desc}
                </p>
              </div>
            </div>
            <button
              disabled
              className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 dark:bg-gray-800"
              title="Database connection required"
            >
              Connect (coming soon)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}