import { ExternalLink, TrendingDown, Clock } from "lucide-react";

export default function ProductCard() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg">
      <div className="flex gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <span className="text-sm text-slate-400">Product</span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">Adidas Running Shoes</h3>

          <p className="mt-1 text-sm text-slate-500">Sport Depot</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-xl font-bold text-slate-900">€79.99</span>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <TrendingDown className="h-3.5 w-3.5" />
              -15%
            </span>
          </div>
        </div>

        <a
          href="#"
          aria-label="Open product"
          className="text-slate-400 transition-colors hover:text-emerald-600"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>Previous price: €94.99</span>

        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          Checked 10 min ago
        </span>
      </div>
    </article>
  );
}
