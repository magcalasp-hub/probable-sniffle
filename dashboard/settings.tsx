import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your account and billing.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Your account information.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                disabled
                className="mt-1 block w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                disabled
                className="mt-1 block w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </section>

        {/* Plan Section */}
        <section className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Plan</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            You&apos;re currently on the Starter plan.
          </p>
          <a
            href="/pricing"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Upgrade plan
          </a>
        </section>
      </div>
    </div>
  );
}