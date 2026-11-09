import * as cheerio from "cheerio";

type JsonLd = Record<string, unknown>;
type ProductData = {
  price: number;
  currency: string;
  name: string;
  image: string | null;
};

export function extractJsonLd(html: string): JsonLd[] {
  const $ = cheerio.load(html);
  const result: JsonLd[] = [];

  const jsonLdScripts = $('script[type="application/ld+json"]');

  jsonLdScripts.each((_, element) => {
    try {
      const jsonLd = JSON.parse($(element).text());
      result.push(jsonLd);
    } catch {
      console.log("Invalid JSON-LD block");
    }
  });

  return result;
}

export function findProducts(jsonLds: JsonLd[]) {
  return jsonLds.filter((jsonLd) => jsonLd["@type"] === "Product");
}

export function normalizeProductUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Премахваме hash (#section)
    parsedUrl.hash = "";

    // Премахваме излишните наклонени черти в края
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, "") || "/";

    // Tracking параметри, които не влияят на избрания продукт
    const trackingParams = [
      "gclid",
      "fbclid",
      "dclid",
      "msclkid",
      "yclid",
      "gbraid",
      "wbraid",
      "_ga",
      "_gl",
      "complects",
      "i",
    ];

    // Премахваме tracking параметрите
    for (const key of [...parsedUrl.searchParams.keys()]) {
      if (
        key.toLowerCase().startsWith("utm_") ||
        trackingParams.includes(key.toLowerCase())
      ) {
        parsedUrl.searchParams.delete(key);
      }
    }

    // Подреждаме останалите параметри
    parsedUrl.searchParams.sort();

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

function hasMatchingUrl(product: JsonLd, url: string): boolean {
  const normalizedTarget = normalizeProductUrl(url);

  if (!normalizedTarget) {
    return false;
  }

  if (
    typeof product.url === "string" &&
    normalizeProductUrl(product.url) === normalizedTarget
  ) {
    return true;
  }

  const offers = extractOffers(product);

  return offers.some(
    (offer) =>
      typeof offer.url === "string" &&
      normalizeProductUrl(offer.url) === normalizedTarget,
  );
}

export function findProductByUrl(
  jsonLds: JsonLd[],
  url: string,
): JsonLd | null {
  if (!url) {
    return null;
  }

  for (const jsonLd of jsonLds) {
    // Обикновен Product
    if (jsonLd["@type"] === "Product") {
      if (hasMatchingUrl(jsonLd, url)) {
        return jsonLd;
      }
    }

    // ProductGroup с отделни варианти
    if (
      jsonLd["@type"] === "ProductGroup" &&
      Array.isArray(jsonLd.hasVariant)
    ) {
      const variant = jsonLd.hasVariant.find(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          !Array.isArray(item) &&
          hasMatchingUrl(item as JsonLd, url),
      );

      if (variant) {
        return variant as JsonLd;
      }
    }
  }

  return null;
}

export function normalizeJsonLd(data: unknown): JsonLd[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is JsonLd =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    );
  }

  if (typeof data !== "object" || data === null) {
    return [];
  }

  if ("@graph" in data && Array.isArray(data["@graph"])) {
    return normalizeJsonLd(data["@graph"]);
  }

  return [data as JsonLd];
}

export function extractOffers(product: JsonLd): JsonLd[] {
  const offers = product.offers;

  if (offers === undefined || offers === null) {
    return [];
  }

  if (Array.isArray(offers)) {
    return offers.filter(
      (offer): offer is JsonLd =>
        typeof offer === "object" && offer !== null && !Array.isArray(offer),
    );
  }

  if (typeof offers === "object") {
    return [offers as JsonLd];
  }

  return [];
}

export function extractPrice(offer: JsonLd): number | null {
  const price = offer.price;

  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  if (typeof price === "string") {
    const parsedPrice = Number(price);

    if (Number.isFinite(parsedPrice)) {
      return parsedPrice;
    }
  }

  return null;
}

export function extractCurrency(offer: JsonLd): string | null {
  const currency = offer.priceCurrency;

  if (typeof currency !== "string") {
    return null;
  }

  return currency.toUpperCase();
}

export function extractProductName(product: JsonLd): string | null {
  const name = product.name;

  if (typeof name !== "string") {
    return null;
  }

  const trimedName = name?.trim();

  if (!trimedName) {
    return null;
  }

  return trimedName;
}

export function extractProductImage(product: JsonLd): string | null {
  const image = product.image;

  if (typeof image === "string" && image.trim()) {
    return image.trim();
  }

  if (Array.isArray(image)) {
    for (const item of image) {
      if (typeof item === "string" && item.trim()) {
        return item.trim();
      }

      if (typeof item === "object" && item !== null) {
        const imageObject = item as Record<string, unknown>;

        const imageUrl = imageObject.url ?? imageObject.contentUrl;

        if (typeof imageUrl === "string" && imageUrl.trim()) {
          return imageUrl.trim();
        }
      }
    }
  }

  if (typeof image === "object" && image !== null) {
    const imageObject = image as Record<string, unknown>;

    const imageUrl = imageObject.url ?? imageObject.contentUrl;

    if (typeof imageUrl === "string" && imageUrl.trim()) {
      return imageUrl.trim();
    }
  }

  return null;
}

export function extractProductData(product: JsonLd): ProductData | null {
  const offers = extractOffers(product);

  if (offers.length === 0) {
    return null;
  }

  const offer = offers[0];

  const price = extractPrice(offer);

  if (price === null) {
    return null;
  }

  const currency = extractCurrency(offer);

  if (currency === null) {
    return null;
  }

  const name = extractProductName(product);

  if (name === null) {
    return null;
  }

  const image = extractProductImage(product);

  if (image === null) {
    return null;
  }

  return {
    name,
    price,
    currency,
    image,
  };
}

export function extractProductDataFromHtml(
  html: string,
  url: string,
): ProductData | null {
  const jsonLds = extractJsonLd(html);
  const normalized = jsonLds.flatMap(normalizeJsonLd);

  const product = findProductByUrl(normalized, url);

  if (!product) {
    return null;
  }

  return extractProductData(product);
}
