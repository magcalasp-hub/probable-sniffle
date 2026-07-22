import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-blush-100 px-3 py-1 text-sm font-medium text-rose-gold-700 dark:bg-rose-gold-950 dark:text-rose-gold-300">
              Your integrations, automated
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Connect your tools. <span className="text-rose-gold-600">Automate everything.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-warm-600 dark:text-warm-400">
              LoomLink connects your CRM, email, payments, bookings, and more — then automates your routine workflows.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a href="/signup" className="rounded-lg bg-rose-gold-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-rose-gold-500">Start free trial</a>
              <a href="/features" className="rounded-lg border border-warm-300 px-8 py-3 text-base font-semibold text-warm-700 hover:bg-cream-50 dark:border-warm-700 dark:text-warm-300">See features</a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-warm-200 bg-cream-50 dark:border-warm-800 dark:bg-warm-700">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[{ label: "Integrations", value: "50+" },{ label: "Workflows automated", value: "10K+" },{ label: "Active users", value: "5K+" },{ label: "Hours saved/month", value: "40K+" }].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-rose-gold-600">{stat.value}</div>
                <div className="mt-1 text-sm text-warm-600 dark:text-warm-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to connect and automate</h2>
            <p className="mt-4 text-lg text-warm-600 dark:text-warm-400">From simple connections to complex multi-step workflows.</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[{ title: "One-click integrations", desc: "Connect Stripe, Gmail, Slack, and more with a single click." },{ title: "Visual workflow builder", desc: "Drag, drop, and configure without writing code." },{ title: "Schedule & triggers", desc: "Run on cron, fire from webhooks, or trigger manually." },{ title: "Real-time monitoring", desc: "Watch workflows run in real-time. Get alerts on failures." },{ title: "Secure by default", desc: "OAuth encrypted at rest. HTTP-only cookies. SOC 2." },{ title: "Team collaboration", desc: "Share workflows. Set permissions. Audit changes." }].map((f) => (
              <div key={f.title} className="rounded-xl border border-warm-200 p-6 dark:border-warm-800">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-warm-600 dark:text-warm-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose-gold-600 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to automate your workflows?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blush-100">Start your free trial. No credit card required.</p>
          <div className="mt-10">
            <a href="/signup" className="inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-rose-gold-600 shadow-sm hover:bg-blush-50">Get started free</a>
          </div>
        </div>
      </section>
    </>
  );
}
