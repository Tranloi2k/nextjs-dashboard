import { NextRequest, NextResponse } from "next/server";
import { getCheckoutAuth } from "@/app/lib/checkout-auth";
import { createProductCheckoutSession } from "@/app/lib/checkout-sessions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const checkoutAuth = await getCheckoutAuth();
  if (!checkoutAuth.authorized) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const { productId, productName, price, quantity, customerEmail } =
      await request.json();

    // Validate required fields
    if (!productId || !productName || !price || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create product object
    const product = {
      id: productId,
      name: productName,
      price: parseFloat(price),
      description: `Purchase of ${productName}`,
    };

    const stripeSession = await createProductCheckoutSession(
      product,
      parseInt(quantity, 10),
      customerEmail ?? checkoutAuth.customerEmail,
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
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}