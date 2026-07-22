import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

const guides = [
  {
    title: "Getting Started",
    items: [
      { name: "What is LoomLink?", desc: "LoomLink connects your business tools and automates routine workflows — order processing, customer follow-ups, invoice reconciliation, appointment reminders. Set it up once, it runs on autopilot." },
      { name: "Quickstart guide", desc: "Connect your first integration, create a workflow, and run it — in under 5 minutes." },
      { name: "Understanding integrations", desc: "Integrations are connections to your external services (Stripe, Gmail, Slack, etc.). Each integration gives LoomLink access to read and perform actions on your behalf." },
      { name: "Understanding workflows", desc: "Workflows are sequences of automated actions triggered by a schedule, webhook, or manual run. Each step can pass data to the next step using template variables." },
    ],
  },
  {
    title: "Integration Guides",
    items: [
      { name: "Stripe", desc: "Connect Stripe to automate payment reconciliation, invoice creation, and transaction monitoring. Requires your Stripe API key.", details: ["Operations: List new payments, Create invoices, Reconcile transactions", "Auth: API Key (sk_live_ or sk_test_)", "Go to Dashboard → Integrations → Stripe → Connect", "Paste your Stripe Secret Key and save"] },
      { name: "Gmail", desc: "Connect Gmail to send automated emails, search inboxes, and archive threads. Uses OAuth 2.0.", details: ["Operations: Send email, Search inbox, Archive thread", "Auth: OAuth 2.0", "Click Connect → Authorize with Google", "Grant the requested permissions"] },
      { name: "Slack", desc: "Connect Slack to send messages to channels, list channels, and react to messages. Uses OAuth 2.0.", details: ["Operations: Send message, List channels, Add reaction", "Auth: OAuth 2.0", "Click Connect → Authorize with Slack", "Grant permissions and the integration is ready"] },
      { name: "Calendly", desc: "Connect Calendly to list events, get invitee details, and send reminders. Uses OAuth 2.0.", details: ["Operations: List events, Get invitee details, Send reminders", "Auth: OAuth 2.0"] },
      { name: "Shopify", desc: "Connect Shopify to monitor orders, check inventory, and manage products. Uses OAuth 2.0.", details: ["Operations: List new orders, Check inventory levels, Update product", "Auth: OAuth 2.0"] },
      { name: "HubSpot", desc: "Connect HubSpot to sync contacts, create deals, and log activities. Uses OAuth 2.0.", details: ["Operations: Create contact, Create deal, Log activity", "Auth: OAuth 2.0"] },
      { name: "Notion", desc: "Connect Notion to create pages, add database items, and search content. Uses OAuth 2.0.", details: ["Operations: Create page, Add database item, Search content", "Auth: OAuth 2.0"] },
    ],
  },
  {
    title: "Workflow Tutorials",
    items: [
      { name: "Creating your first workflow", desc: "Step-by-step guide to building an automated workflow — from trigger to action chain." },
      { name: "Scheduled workflows (cron)", desc: "Run workflows on a schedule using cron expressions. Examples: every hour, every weekday at 9 AM." },
      { name: "Webhook triggers", desc: "Trigger workflows from external events using incoming webhooks. Includes payload format reference." },
      { name: "Action chaining & template variables", desc: "Pass data between steps using {{variable}} syntax. Chain multiple actions and use outputs from earlier steps." },
      { name: "Testing workflows", desc: "Run your workflow manually before enabling it in production to verify it works correctly." },
    ],
  },
  {
    title: "API Reference",
    items: [
      { name: "Authentication", desc: "All API requests require a valid session cookie.", details: ["POST /api/auth/login — Authenticate", "POST /api/auth/signup — Create account", "POST /api/auth/logout — Clear session", "GET /api/auth/session — Check session"] },
      { name: "Integrations API", desc: "Manage your connected integrations.", details: ["GET /api/integrations — List integrations", "POST /api/integrations — Connect new", "DELETE /api/integrations/:id — Disconnect"] },
      { name: "Workflows API", desc: "CRUD workflows programmatically.", details: ["GET /api/workflows — List workflows", "POST /api/workflows — Create workflow", "DELETE /api/workflows/:id — Delete", "POST /api/workflows/:id/run — Trigger run"] },
      { name: "Webhook events", desc: "Payload formats and signatures for incoming webhook events." },
      { name: "Rate limits", desc: "100 requests/minute/user. Webhook deliveries retried 3 times." },
    ],
  },
];

function DocsPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Documentation</h1>
          <p className="mt-4 text-lg text-warm-600 dark:text-warm-400">Everything you need to get the most out of LoomLink.</p>
        </div>

        <a href="#quickstart" className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 rounded-xl border-2 border-dashed border-rose-gold-300 p-4 text-rose-gold-700 transition-colors hover:border-rose-gold-400 hover:bg-blush-50 dark:border-rose-gold-700 dark:text-rose-gold-300 dark:hover:border-rose-gold-500 dark:hover:bg-rose-gold-950">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-semibold">New to LoomLink? Start with the Quickstart Guide →</span>
        </a>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {guides.map((section) => (
            <div key={section.title} className={section.title === "Integration Guides" ? "md:col-span-2" : ""}>
              <h2 className="text-xl font-bold text-rose-gold-600">{section.title}</h2>
              <div className="mt-6 space-y-6">
                {section.items.map((item) => (
                  <div key={item.name}>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-warm-600 dark:text-warm-400">{item.desc}</p>
                    {item.details && (
                      <ul className="mt-2 space-y-1 text-xs text-warm-500">
                        {item.details.map((d) => (
                          <li key={d} className="flex items-start gap-1.5">
                            <svg className="mt-0.5 h-3 w-3 shrink-0 text-rose-gold-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div id="quickstart" className="mt-20 scroll-mt-20">
          <h2 className="text-2xl font-bold">Quickstart Guide</h2>
          <div className="mt-6 space-y-8">
            <div className="rounded-xl border border-warm-200 p-6 dark:border-warm-800">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-gold-600 text-sm font-bold text-white">1</span>
                <h3 className="text-lg font-semibold">Connect an integration</h3>
              </div>
              <p className="mt-3 text-sm text-warm-600 dark:text-warm-400">Go to the Integrations page in your dashboard. Pick a service (Stripe, Gmail, Slack, etc.) and click Connect. For API-key-based services, paste your key. For OAuth services, you'll be redirected to authorize access.</p>
            </div>
            <div className="rounded-xl border border-warm-200 p-6 dark:border-warm-800">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-gold-600 text-sm font-bold text-white">2</span>
                <h3 className="text-lg font-semibold">Create a workflow</h3>
              </div>
              <p className="mt-3 text-sm text-warm-600 dark:text-warm-400">Go to Workflows → New Workflow. Give it a name, choose a trigger (Manual, Schedule, or Webhook), then add action steps. Each step picks a connector and an operation. Save when you're done.</p>
            </div>
            <div className="rounded-xl border border-warm-200 p-6 dark:border-warm-800">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-gold-600 text-sm font-bold text-white">3</span>
                <h3 className="text-lg font-semibold">Run it</h3>
              </div>
              <p className="mt-3 text-sm text-warm-600 dark:text-warm-400">From the Workflows list, click Run to test your workflow manually. Check the Activity log to see results. Once everything works, enable the workflow to run on its trigger schedule automatically.</p>
            </div>
          </div>
        </div>

        <div id="action-chaining" className="mt-20 scroll-mt-20">
          <h2 className="text-2xl font-bold">Template Variables</h2>
          <p className="mt-2 text-sm text-warm-600 dark:text-warm-400">Use <code className="rounded bg-warm-100 px-1.5 py-0.5 text-xs font-mono dark:bg-warm-800">{`{{variable}}`}</code> syntax to reference data from triggers or previous steps.</p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-warm-200 dark:border-warm-800">
            <table className="min-w-full divide-y divide-warm-200 text-sm dark:divide-warm-800">
              <thead className="bg-warm-50 dark:bg-warm-900">
                <tr><th className="px-4 py-3 text-left font-semibold">Pattern</th><th className="px-4 py-3 text-left font-semibold">Description</th></tr>
              </thead>
              <tbody className="divide-y divide-warm-200 dark:divide-warm-800">
                <tr><td className="px-4 py-3 font-mono text-xs">{`{{trigger.event}}`}</td><td className="px-4 py-3 text-warm-600 dark:text-warm-400">The webhook event payload or manual run context</td></tr>
                <tr><td className="px-4 py-3 font-mono text-xs">{`{{trigger.scheduled_at}}`}</td><td className="px-4 py-3 text-warm-600 dark:text-warm-400">ISO timestamp of when a scheduled workflow fired</td></tr>
                <tr><td className="px-4 py-3 font-mono text-xs">{`{{step_name.output_key}}`}</td><td className="px-4 py-3 text-warm-600 dark:text-warm-400">Output value from a previous action step</td></tr>
                <tr><td className="px-4 py-3 font-mono text-xs">{`{{step_name.result}}`}</td><td className="px-4 py-3 text-warm-600 dark:text-warm-400">Full result object from a previous step</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="scheduled-workflows" className="mt-20 scroll-mt-20">
          <h2 className="text-2xl font-bold">Cron Schedule Reference</h2>
          <p className="mt-2 text-sm text-warm-600 dark:text-warm-400">Standard cron syntax with 5 fields: minute hour day-of-month month day-of-week.</p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-warm-200 dark:border-warm-800">
            <table className="min-w-full divide-y divide-warm-200 text-sm dark:divide-warm-800">
              <thead className="bg-warm-50 dark:bg-warm-900">
                <tr><th className="px-4 py-3 text-left font-semibold">Expression</th><th className="px-4 py-3 text-left font-semibold">Meaning</th></tr>
              </thead>
              <tbody className="divide-y divide-warm-200 dark:divide-warm-800">
                <tr><td className="px-4 py-3 font-mono text-xs">* * * * *</td><td className="px-4 py-3 text-warm-600 dark:text-warm-400">Every minute</td></tr>
                <tr><td className="px-4 py-3 font-mono text-xs">*/15 * * * *</td><td className="px-4 py-3 text-warm-600 dark:text-warm-400">Every 15 minutes</td></tr>
                <tr><td className="px-4 py-3 font-mono text-xs">0 * * * *</td><td className="px-4 py-3 text-warm-600 dark:text-warm-400">Every hour at :00</td></tr>
                <tr><td className="px-4 py-3 font-mono text-xs">0 9 * * *</td><td className="px-4 py-3 text-warm-600 dark:text-warm-400">Every day at 9:00 AM</td></tr>
                <tr><td className="px-4 py-3 font-mono text-xs">0 9 * * 1-5</td><td className="px-4 py-3 text-warm-600 dark:text-warm-400">Weekdays at 9:00 AM</td></tr>
                <tr><td className="px-4 py-3 font-mono text-xs">0 0 1 * *</td><td className="px-4 py-3 text-warm-600 dark:text-warm-400">First day of month at midnight</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 rounded-xl border border-warm-200 bg-warm-50 p-8 text-center dark:border-warm-800 dark:bg-warm-900">
          <h2 className="text-xl font-bold">Need help?</h2>
          <p className="mt-2 text-warm-600 dark:text-warm-400">Can&apos;t find what you&apos;re looking for? Reach out to our support team.</p>
          <a href="#" className="mt-4 inline-block text-sm font-medium text-rose-gold-600 hover:underline">Contact support →</a>
        </div>
      </div>
    </div>
  );
}