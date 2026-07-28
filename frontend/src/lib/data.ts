import { apiGet } from "./api";
import type {
  CategoryDetail,
  CategoryTreeNode,
  Paginated,
  ProductDetail,
  ProductList,
  SiteSettings,
} from "./types";

const REVALIDATE_SECONDS = 60;

export function getSiteSettings() {
  return apiGet<SiteSettings>("/site-settings/", REVALIDATE_SECONDS);
}

export function getCategoryTree() {
  return apiGet<Paginated<CategoryTreeNode>>("/categories/?tree=1", REVALIDATE_SECONDS);
}

export function getCategory(slug: string) {
  return apiGet<CategoryDetail>(`/categories/${slug}/`, REVALIDATE_SECONDS);
}

export function getProducts(
  params: {
    category?: string;
    search?: string;
    ordering?: string;
    onSale?: boolean;
    minRating?: number;
  } = {}
) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.ordering) qs.set("ordering", params.ordering);
  if (params.onSale) qs.set("on_sale", "true");
  if (params.minRating !== undefined) qs.set("min_rating", String(params.minRating));
  const query = qs.toString();
  return apiGet<Paginated<ProductList>>(`/products/${query ? `?${query}` : ""}`, REVALIDATE_SECONDS);
}

export function getProduct(slug: string) {
  return apiGet<ProductDetail>(`/products/${slug}/`, REVALIDATE_SECONDS);
}
