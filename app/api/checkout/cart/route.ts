import { NextResponse } from "next/server";
import { getCheckoutAuth } from "@/app/lib/checkout-auth";
import { createCartCheckoutSession } from "@/app/lib/checkout-sessions";
import { getCartSummary } from "@/app/lib/services/cart";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const checkoutAuth = await getCheckoutAuth();
  if (!checkoutAuth.authorized) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const summary = await getCartSummary();
    const items = summary.cart?.items ?? [];

    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const products = items.map((item) => ({
      product: {
        id: String(item.product.id),
        name: item.product.name,
        price: Number(item.price),
        description: item.product.name,
        image: item.product.image,
      },
      quantity: item.quantity,
    }));

    const stripeSession = await createCartCheckoutSession(
      products,
      checkoutAuth.customerEmail,
    );

    if (!stripeSession.url) {
      return NextResponse.json(
        { error: "Checkout session has no redirect URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
    });
  } catch (error) {
    console.error("Error creating cart checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
