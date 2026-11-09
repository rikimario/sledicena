import { NextRequest, NextResponse } from "next/server";
import { extractProductDataFromHtml } from "@/lib/price-extractor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid product URL is required." },
        { status: 400 },
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are supported." },
        { status: 400 },
      );
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Could not access the product page." },
        { status: 502 },
      );
    }

    const html = await response.text();

    const productData = extractProductDataFromHtml(html, parsedUrl.toString());

    if (!productData) {
      return NextResponse.json(
        { error: "Could not find this exact product." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      product: {
        id: crypto.randomUUID(),
        url: parsedUrl.toString(),
        ...productData,
        previousPrice: null,
        lastCheckedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Product extraction error:", error);

    return NextResponse.json(
      { error: "Something went wrong while extracting the product." },
      { status: 500 },
    );
  }
}
