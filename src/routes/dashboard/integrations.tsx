import { createFileRoute } from "@tanstack/react-router";
import DashboardLayout from "~/components/dashboard-layout";
import { useState, useEffect } from "react";
import {
  getConnectors,
  createIntegration,
  deleteIntegration,
} from "~/lib/integration-api";
import type { ConnectorInfo, IntegrationInfo } from "~/lib/integration-api";

export const Route = createFileRoute("/dashboard/integrations")({
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorInfo | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [configError, setConfigError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const conns = await getConnectors();
        setConnectors(conns);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  async function handleConnect(connector: ConnectorInfo) {
    if (connector.authType === "oauth2" && connector.configFields.length === 0) {
      setConnecting(connector.id);
      alert(
        `${connector.name} would redirect to OAuth authorization.\n\nConfigure OAuth credentials in settings to enable this flow.`,
      );
      setConnecting(null);
      return;
    }
    setSelectedConnector(connector);
    setConfigValues({});
    setConfigError("");
  }

  async function handleConfigSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedConnector) return;

    setConnecting(selectedConnector.id);
    setConfigError("");

    try {
      const result = await createIntegration({
        providerId: selectedConnector.id,
        label: `${selectedConnector.name} connection`,
        config: configValues,
      });

      if (result.ok && result.data) {
        setIntegrations((prev) => [...prev, result.data!.integration]);
        setSelectedConnector(null);
      } else {
        setConfigError(result.error || "Connection failed");
      }
    } catch {
      setConfigError("Connection error");
    } finally {
      setConnecting(null);
    }
  }

  async function handleDisconnect(integrationId: string) {
    if (!confirm("Disconnect this integration?")) return;
    const result = await deleteIntegration({ id: integrationId });
    if (result.ok) {
      setIntegrations((prev) => prev.filter((i) => i.id !== integrationId));
    }
  }

  const connectedIds = new Set(integrations.map((i) => i.providerId));

  return (
    <DashboardLayout currentPath="/dashboard/integrations">
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="mt-1 text-sm text-warm-600 dark:text-warm-400">
            Connect your tools to LoomLink. One click to enable.
          </p>
        </div>

        {integrations.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Connected</h2>
            <div className="space-y-3">
              {integrations.map((int) => (
                <div
                  key={int.id}
                  className="flex items-center justify-between rounded-lg border border-warm-200 p-4 dark:border-warm-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {connectors.find((c) => c.id === int.providerId)?.icon || "🔌"}
                    </span>
                    <div>
                      <p className="font-medium">{int.providerName}</p>
                      <p className="text-sm text-warm-500">
                        {int.label || int.providerDesc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${int.enabled ? "bg-green-500" : "bg-warm-400"}`}
                    />
                    <button
                      onClick={() => handleDisconnect(int.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-4 text-lg font-semibold">Available integrations</h2>
          {loading ? (
            <p className="text-warm-500">Loading...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {connectors.map((connector) => {
                const isConnected = connectedIds.has(connector.id);
                return (
                  <div
                    key={connector.id}
                    className="rounded-xl border border-warm-200 p-5 hover:shadow-sm dark:border-warm-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{connector.icon}</span>
                        <div>
                          <h3 className="font-semibold">{connector.name}</h3>
                          <p className="text-sm text-warm-500">
                            {connector.description}
                          </p>
                          <span className="mt-1 inline-block rounded bg-warm-100 px-2 py-0.5 text-xs text-warm-600 dark:bg-warm-800 dark:text-warm-400">
                            {connector.authType === "oauth2" ? "OAuth" : "API Key"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isConnected ? (
                      <span className="mt-4 inline-block rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                        Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConnect(connector)}
                        disabled={connecting === connector.id}
                        className="mt-4 rounded-lg bg-rose-gold-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-gold-500 disabled:opacity-50"
                      >
                        {connecting === connector.id ? "Connecting..." : "Connect"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedConnector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-warm-900">
              <h2 className="text-lg font-bold">
                Connect {selectedConnector.name}
              </h2>
              <p className="mt-1 text-sm text-warm-600 dark:text-warm-400">
                Enter your credentials to connect.
              </p>
              {configError && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                  {configError}
                </div>
              )}
              <form onSubmit={handleConfigSubmit} className="mt-4 space-y-4">
                {selectedConnector.configFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-warm-700 dark:text-warm-300">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={configValues[field.key] || ""}
                      onChange={(e) =>
                        setConfigValues((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-lg border border-warm-300 px-3 py-2 text-sm dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
                    />
                  </div>
                ))}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={!!connecting}
                    className="flex-1 rounded-lg bg-rose-gold-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-gold-500 disabled:opacity-50"
                  >
                    {connecting ? "Connecting..." : "Connect"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedConnector(null)}
                    className="rounded-lg border border-warm-300 px-4 py-2 text-sm font-medium text-warm-700 hover:bg-warm-50 dark:border-warm-700 dark:text-warm-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}