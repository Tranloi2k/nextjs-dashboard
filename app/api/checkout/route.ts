import { NextRequest, NextResponse } from "next/server";
import { createProductCheckoutSession } from "@/app/lib/checkout-sessions";

export async function POST(request: NextRequest) {
  try {
    const { productId, productName, price, quantity, customerEmail } = await request.json();

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

    // Create checkout session
    const session = await createProductCheckoutSession(
      product,
      parseInt(quantity),
      customerEmail
    );

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}