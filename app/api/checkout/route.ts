import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";
import type { CartItem } from "@/lib/cart/types";

type CheckoutRequest = {
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  locale?: string;
};

export async function POST(req: Request) {
  let body: CheckoutRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "body inválido" }, { status: 400 });
  }

  if (!body.items?.length) {
    return NextResponse.json({ error: "carrito vacío" }, { status: 400 });
  }

  const { name, email, phone, address } = body.customer ?? {};
  if (!name || !email || !phone || !address) {
    return NextResponse.json(
      { error: "nombre, email, teléfono y dirección requeridos" },
      { status: 400 },
    );
  }

  const productIds = body.items.map((i) => i.productId);
  const products = await prisma.products.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      price_cents: true,
      currency: true,
      external_product_url: true,
      external_sku: true,
      is_available: true,
      is_active: true,
    },
  });

  const byId = new Map(products.map((p) => [p.id, p]));

  const lineItems: {
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string };
    };
  }[] = [];

  const orderItems: {
    product_id: string;
    name: string;
    quantity: number;
    unit_price_cents: number;
    external_product_url: string | null;
    external_sku: string | null;
  }[] = [];

  let totalCents = 0;
  let currency = "EUR";

  for (const item of body.items) {
    const product = byId.get(item.productId);
    if (!product || !product.is_available || !product.is_active) {
      return NextResponse.json(
        { error: `producto no disponible: ${item.productId}` },
        { status: 400 },
      );
    }
    const qty = Math.max(1, Math.floor(item.quantity));
    currency = product.currency;
    const unitAmount = product.price_cents;
    totalCents += unitAmount * qty;

    lineItems.push({
      quantity: qty,
      price_data: {
        currency: product.currency,
        unit_amount: unitAmount,
        product_data: { name: product.name },
      },
    });

    orderItems.push({
      product_id: product.id,
      name: product.name,
      quantity: qty,
      unit_price_cents: unitAmount,
      external_product_url: product.external_product_url,
      external_sku: product.external_sku,
    });
  }

  const order = await prisma.orders.create({
    data: {
      status: "new",
      customer_name: name,
      customer_email: email,
      customer_phone: body.customer.phone || null,
      shipping_address: body.customer.address || null,
      currency,
      total_cents: totalCents,
      order_items: { create: orderItems },
    },
  });

  const siteUrl = getSiteUrl();
  const locale =
    body.locale === "en" || body.locale === "pt" ? body.locale : "es";

  const stripe = getStripe();
  let sessionUrl: string | null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: lineItems,
      metadata: { order_id: order.id },
      success_url: `${siteUrl}/${locale}/pago/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/pago/cancel`,
    });
    sessionUrl = session.url;
  } catch {
    await prisma.orders
      .delete({ where: { id: order.id } })
      .catch(() => undefined);
    return NextResponse.json(
      { error: "no se pudo iniciar el pago" },
      { status: 500 },
    );
  }

  if (!sessionUrl) {
    await prisma.orders
      .delete({ where: { id: order.id } })
      .catch(() => undefined);
    return NextResponse.json(
      { error: "no se pudo iniciar el pago" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: sessionUrl });
}
