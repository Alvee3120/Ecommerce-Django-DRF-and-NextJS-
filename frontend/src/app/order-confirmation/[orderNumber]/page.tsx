import { OrderConfirmationClient } from "@/components/order-confirmation-client";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ phone?: string }>;
}) {
  const { orderNumber } = await params;
  const { phone } = await searchParams;

  return <OrderConfirmationClient orderNumber={orderNumber} phone={phone ?? ""} />;
}
