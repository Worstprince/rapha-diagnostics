"use client";

import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatusMessage("Demo mode enabled: authentication is not wired up yet.");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <section className="flex flex-1 flex-col justify-between bg-gradient-to-br from-cyan-600 via-sky-700 to-blue-900 p-8 sm:p-12 lg:p-16">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold uppercase tracking-[0.3em] text-white">
                RD
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white/90">
                Rapha Diagnostics
              </span>
            </div>

            <h1 className="max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
              Welcome back to your care operations hub.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-100/80">
              Manage appointments, results, and workflow handoffs with a calm and dependable experience.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg shadow-slate-950/20 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-100">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 3l7 4v5c0 4.4-2.8 7.6-7 9-4.2-1.4-7-4.6-7-9V7l7-4Z" />
                  <path d="M9.5 12.2l1.7 1.7 3.3-3.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Secure access</p>
                <p className="mt-1 text-sm text-slate-100/80">
                  Role-based sign-in for administrators, clinicians, medtech staff, and reception teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center bg-slate-950 px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/25 backdrop-blur">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
                Portal access
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Sign in</h2>
              <p className="mt-2 text-sm text-slate-400">
                Use your work email and password to continue.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@rapha.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-slate-400">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-400" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="font-medium text-cyan-400 transition hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
                  Forgot password?
                </a>
              </div>

              {statusMessage ? (
                <div role="status" className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
                  {statusMessage}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Continue to dashboard
              </button>
            </form>

            <div className="mt-6 border-t border-slate-800 pt-5 text-center text-sm text-slate-400">
              Need access? Contact your system administrator.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
