import { ExternalLink, TrendingDown, Clock, Trash2 } from "lucide-react";
import { Product } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ProductCardProps = {
  product: Product;
  onDeleteProduct: (id: string) => void;
};

export default function ProductCard({
  product,
  onDeleteProduct,
}: ProductCardProps) {
  const priceDrop =
    product.previousPrice !== null && product.price < product.previousPrice;

  const discount =
    priceDrop && product.previousPrice
      ? Math.round(
          ((product.previousPrice - product.price) / product.previousPrice) *
            100,
        )
      : 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg">
      <div className="flex gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-sm text-slate-400">No image</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 line-clamp-2 min-h-12">
            {product.name}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-xl font-bold text-slate-900">
              {product.price.toFixed(2)} {product.currency}
            </span>

            {priceDrop && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <TrendingDown className="h-3.5 w-3.5" />-{discount}%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Dialog>
            <DialogTrigger>
              <button
                type="button"
                aria-label="Delete product"
                className="rounded-lg p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove product?</DialogTitle>
                <DialogDescription>
                  Are you sure you want to stop tracking this product? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <button
                  type="button"
                  onClick={() => onDeleteProduct(product.id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open product"
            className="text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 p-1 rounded-lg"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>
          {product.previousPrice !== null
            ? `Previous price: ${product.previousPrice.toFixed(2)} ${product.currency}`
            : "No previous price"}
        </span>

        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {product.lastCheckedAt
            ? new Date(product.lastCheckedAt).toLocaleString("en-GB")
            : "Not checked yet"}
        </span>
      </div>
    </article>
  );
}
