import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/product-detail-client";
import { ApiError } from "@/lib/api";
import { getProduct } from "@/lib/data";

export const revalidate = 60;

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

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <ProductDetailClient product={product} />
    </div>
  );
}
