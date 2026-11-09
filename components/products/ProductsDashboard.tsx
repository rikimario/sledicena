import { PackageSearch, Plus } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductsDashboard() {
  // Temporary demo data
  const hasProducts = true;

  return (
    <section id="products" className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Your tracked products
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep an eye on prices and never miss a good deal.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {hasProducts ? "1 product tracked" : "No products yet"}
        </div>
      </div>

      {hasProducts ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ProductCard />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <PackageSearch className="h-7 w-7 text-emerald-600" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            No products tracked yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Add your first product URL above and start monitoring its price.
          </p>

          <a
            href="#"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add your first product
          </a>
        </div>
      )}
    </section>
  );
}
