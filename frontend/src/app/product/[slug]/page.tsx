import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/product-detail-client";
import { RelatedProducts } from "@/components/product/related-products";
import { ApiError } from "@/lib/api";
import { getProduct, getProducts } from "@/lib/data";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product;
  try {
    product = await getProduct(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const related = product.categories.length > 0
    ? await getProducts({ category: product.categories[0] })
    : null;
  const relatedProducts = (related?.results ?? []).filter((p) => p.id !== product.id).slice(0, 5);

  return (
    <div className="mx-auto max-w-[1200px] space-y-16 px-4 py-8">
      <ProductDetailClient product={product} siteUrl={SITE_URL} />
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
