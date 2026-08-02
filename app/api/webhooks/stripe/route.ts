import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { getFulfillmentProvider } from "@/lib/fulfillment";

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET no configurada" },
      { status: 500 },
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, sig ?? "", endpointSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "firma inválida";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (!orderId || session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    try {
      const updated = await prisma.orders.updateMany({
        where: { id: orderId, status: { not: "paid" } },
        data: { status: "paid" },
      });

      if (updated.count === 0) {
        return NextResponse.json({ received: true });
      }

      const order = await prisma.orders.findUnique({
        where: { id: orderId },
        include: { order_items: true },
      });

      if (order) {
        await getFulfillmentProvider().submitOrder({
          id: order.id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          shippingAddress: order.shipping_address,
          currency: order.currency,
          totalCents: order.total_cents,
          items: order.order_items.map((item) => ({
            productId: item.product_id ?? "",
            name: item.name,
            quantity: item.quantity,
            unitPriceCents: item.unit_price_cents,
            externalProductUrl: item.external_product_url ?? "",
            externalSku: item.external_sku,
          })),
        });
      }
    } catch {
      return NextResponse.json(
        { error: "error procesando webhook" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
