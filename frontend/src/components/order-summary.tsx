import type { Order } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Order</p>
          <p className="text-xl font-semibold">{order.order_number}</p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div className="space-y-2 rounded-lg border p-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>
              {item.product_name}
              {item.variation_label ? ` (${item.variation_label})` : ""} &times; {item.quantity}
            </span>
            <span>${item.line_total}</span>
          </div>
        ))}
        <div className="space-y-1 border-t pt-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal}</span>
          </div>
          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
              <span>-${order.discount_amount}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${order.total}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Shipping to</p>
        <p className="text-sm text-muted-foreground">
          {order.customer_name}
          <br />
          {order.address_line1}
          {order.address_line2 ? `, ${order.address_line2}` : ""}
          <br />
          {order.city}
          {order.state_region ? `, ${order.state_region}` : ""} {order.postal_code}
          <br />
          {order.country}
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Status history</p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {order.status_history.map((entry, idx) => (
            <li key={idx}>
              {STATUS_LABELS[entry.status] ?? entry.status} —{" "}
              {new Date(entry.changed_at).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
