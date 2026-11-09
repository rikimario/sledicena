"use client";

import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import ProductsDashboard from "@/components/products/ProductsDashboard";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("sledicena-products");

      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);

        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts);
        }
      }
    } catch (error) {
      console.error("Failed to load saved products:", error);
      localStorage.removeItem("sledicena-products");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("sledicena-products", JSON.stringify(products));
  }, [products, isLoaded]);

  const handleAddProduct = async (url: string) => {
    const normalizedUrl = url.trim();

    const alreadyExists = products.some(
      (product) => product.url === normalizedUrl,
    );

    if (alreadyExists) {
      throw new Error("This product is already being tracked.");
    }

    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: normalizedUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add product.");
    }

    setProducts((currentProducts) => [...currentProducts, data.product]);
  };

  const handleDeleteProduct = (id: string) => {
    const deleteProduct = products.filter((product) => product.id !== id);

    setProducts(deleteProduct);
  };
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero onAddProduct={handleAddProduct} />
      <ProductsDashboard
        products={products}
        onDeleteProduct={handleDeleteProduct}
      />
    </main>
  );
}
