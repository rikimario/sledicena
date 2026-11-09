import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import ProductsDashboard from "@/components/products/ProductsDashboard";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <ProductsDashboard />
    </main>
  );
}
