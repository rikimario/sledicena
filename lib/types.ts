export type Product = {
  id: string;
  url: string;
  name: string;
  price: number;
  currency: string;
  image: string | null;
  previousPrice: number | null;
  lastCheckedAt: string | null;
};
