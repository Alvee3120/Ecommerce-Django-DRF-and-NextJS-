export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SiteSettings {
  site_name: string;
  favicon: string | null;
  logo: string | null;
  primary_color: string;
  secondary_color: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  image: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface CategoryDetail extends Category {
  meta_title: string;
  meta_description: string;
  children: Category[];
}

export interface CategoryTreeNode {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  sort_order: number;
  children: CategoryTreeNode[];
}

export interface AttributeValue {
  id: number;
  attribute: string;
  attribute_slug: string;
  value: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  sort_order: number;
}

export interface ProductVariation {
  id: number;
  sku: string;
  attribute_values: AttributeValue[];
  regular_price: string;
  discount_price: string | null;
  effective_price: string;
  stock: number;
  image: string | null;
  is_active: boolean;
}

export type ProductType = "base" | "variable";

export type ProductBadge = "" | "hot" | "new" | "sale";

export interface ProductList {
  id: number;
  name: string;
  slug: string;
  product_type: ProductType;
  categories: string[];
  regular_price: string | null;
  discount_price: string | null;
  effective_price: string | null;
  starting_price: string | null;
  stock: number | null;
  is_active: boolean;
  badge: ProductBadge;
  primary_image: string | null;
  images: ProductImage[];
  colors: string[];
  sizes: string[];
}

export interface ProductDetail extends ProductList {
  description: string;
  meta_title: string;
  meta_description: string;
  variations: ProductVariation[];
}

export interface Popup {
  id: number;
  title: string;
  image: string | null;
  text: string;
  button_text: string;
  button_link: string;
  delay_seconds: number;
}

export interface CouponValidateResponse {
  valid: boolean;
  discount_amount: string;
  message: string;
}

export interface OrderItem {
  product_name: string;
  variation_label: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface OrderStatusHistoryEntry {
  status: string;
  changed_at: string;
  note: string;
}

export interface Order {
  order_number: string;
  status: string;
  customer_name: string;
  phone_number: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state_region: string;
  postal_code: string;
  country: string;
  coupon_code: string | null;
  subtotal: string;
  discount_amount: string;
  total: string;
  items: OrderItem[];
  status_history: OrderStatusHistoryEntry[];
  created_at: string;
}

export interface CheckoutItemPayload {
  product_id: number;
  variation_id?: number;
  quantity: number;
}

export interface CheckoutPayload {
  customer_name: string;
  phone_number: string;
  email?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_region?: string;
  postal_code?: string;
  country: string;
  coupon_code?: string;
  items: CheckoutItemPayload[];
}

export interface ApiErrorBody {
  [key: string]: string[] | string | undefined;
}
