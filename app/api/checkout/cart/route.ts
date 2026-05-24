import { NextResponse } from "next/server";
import { createCartCheckoutSession } from "@/app/lib/checkout-sessions";
import { getCartSummary } from "@/app/lib/services/cart";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
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

    const session = await createCartCheckoutSession(products);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating cart checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
