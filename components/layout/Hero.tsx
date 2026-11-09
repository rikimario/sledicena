"use client";

import { ArrowRight, Link2, ShieldCheck, TrendingDown } from "lucide-react";
import { useState } from "react";

type HeroProps = {
  onAddProduct: (url: string) => Promise<void>;
};

export default function Hero({ onAddProduct }: HeroProps) {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const handleAddProduct = async () => {
    setIsLoading(true);

    try {
      await onAddProduct(url);
      setUrl("");
      setError("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-50 via-white to-white" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <TrendingDown className="h-4 w-4" />
            Smart price tracking
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Never miss a <span className="text-emerald-600">price drop</span>{" "}
            again.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Track your favorite products, monitor price changes, and know
            exactly when it&apos;s the right time to buy.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 px-3">
                <Link2 className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste a product URL..."
                  className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="button"
                onClick={handleAddProduct}
                disabled={!url.trim() || isLoading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Track price"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {error && (
              <span className="text-red-400 flex text-start mt-2">{error}</span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Free to use
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-emerald-600" />
              Automatic price tracking
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
