import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">
          Create your LoomLink account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-rose-gold-600 hover:underline">
            Log in
          </a>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-rose-gold-500 focus:outline-none focus:ring-1 focus:ring-rose-gold-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-rose-gold-500 focus:outline-none focus:ring-1 focus:ring-rose-gold-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-rose-gold-500 focus:outline-none focus:ring-1 focus:ring-rose-gold-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-rose-gold-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-gold-500 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}