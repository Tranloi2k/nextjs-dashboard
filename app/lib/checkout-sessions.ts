import type { Stripe } from "stripe";
import { NextRequest, NextResponse } from "next/server";

// Initialize Stripe on server side
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CURRENCY = "usd";

// Helper function to format amount for Stripe (convert to cents)
function formatAmountForStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

// Helper function to format amount from Stripe (convert from cents)
function formatAmountFromStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount / 100);
}

// Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

// Create Checkout Session for single product
export async function createProductCheckoutSession(
  product: Product,
  quantity: number = 1,
  customerEmail?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Checkout.Session> {
  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: product.name,
              description: product.description || `Product: ${product.name}`,
              images: product.image ? [product.image] : [],
            },
            unit_amount: formatAmountForStripe(product.price, CURRENCY),
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        product_id: product.id,
        quantity: quantity.toString(),
        ...metadata,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      billing_address_collection: "required",
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);
    return checkoutSession;
  } catch (error) {
    console.error("Error creating product checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}

// Create Checkout Session for multiple products (cart)
export async function createCartCheckoutSession(
  products: Array<{ product: Product; quantity: number }>,
  customerEmail?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Checkout.Session> {
  try {
    const lineItems = products.map(({ product, quantity }) => ({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: product.name,
          description: product.description || `Product: ${product.name}`,
          images: product.image ? [product.image] : [],
        },
        unit_amount: formatAmountForStripe(product.price, CURRENCY),
      },
      quantity: quantity,
    }));

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        order_type: "cart",
        item_count: products.length.toString(),
        ...metadata,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      billing_address_collection: "required",
      automatic_tax: {
        enabled: true,
      },
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);
    return checkoutSession;
  } catch (error) {
    console.error("Error creating cart checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}

// Retrieve Checkout Session
export async function retrieveCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });
    return session;
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    throw new Error("Failed to retrieve checkout session");
  }
}

// Webhook handler for Stripe events
export async function handleStripeWebhook(
  request: NextRequest
): Promise<NextResponse> {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ Checkout session completed:", session.id);
        await handleSuccessfulPayment(session);
        break;

      case "checkout.session.async_payment_succeeded":
        const asyncSession = event.data.object as Stripe.Checkout.Session;
        console.log("✅ Async payment succeeded:", asyncSession.id);
        await handleSuccessfulPayment(asyncSession);
        break;

      case "checkout.session.async_payment_failed":
        const failedSession = event.data.object as Stripe.Checkout.Session;
        console.log("❌ Async payment failed:", failedSession.id);
        await handleFailedPayment(failedSession);
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("💳 Payment intent succeeded:", paymentIntent.id);
        break;

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}

// Handle successful payment
async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    console.log("🎉 Processing successful payment for session:", session.id);

    // Extract metadata
    const { product_id, quantity, order_type } = session.metadata || {};

    // Update database with successful payment
    // Example implementations:

    if (order_type === "cart") {
      // Handle cart order
      console.log("📦 Processing cart order");
      // await updateCartOrderStatus(session.id, 'paid');
    } else if (product_id) {
      // Handle single product order
      console.log(`📱 Processing product order: ${product_id} x ${quantity}`);
      // await updateProductOrderStatus(product_id, session.id, 'paid');
    }

    // Send confirmation email
    if (session.customer_email) {
      console.log(
        `📧 Sending confirmation email to: ${session.customer_email}`
      );
      // await sendOrderConfirmationEmail(session.customer_email, session);
    }

    // Update inventory if needed
    if (product_id && quantity) {
      console.log(`📊 Updating inventory for product: ${product_id}`);
      // await updateProductInventory(product_id, parseInt(quantity));
    }
  } catch (error) {
    console.error("❌ Error handling successful payment:", error);
  }
}

// Handle failed payment
async function handleFailedPayment(session: Stripe.Checkout.Session) {
  try {
    console.log("💔 Processing failed payment for session:", session.id);

    // Update order status in database
    // await updateOrderStatus(session.metadata?.order_id, 'failed');

    // Send failure notification
    if (session.customer_email) {
      console.log(
        `📧 Sending failure notification to: ${session.customer_email}`
      );
      // await sendPaymentFailureEmail(session.customer_email, session);
    }
  } catch (error) {
    console.error("❌ Error handling failed payment:", error);
  }
}

// Utility function to create a customer in Stripe
export async function createStripeCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });
    return customer;
  } catch (error) {
    console.error("❌ Error creating Stripe customer:", error);
    throw new Error("Failed to create customer");
  }
}

// Function to redirect to Stripe Checkout (client-side)
export async function redirectToCheckout(sessionId: string) {
  try {
    const { loadStripe } = await import("@stripe/stripe-js");
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    if (!stripe) {
      throw new Error("Stripe failed to load");
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.error("❌ Error redirecting to checkout:", error);
      throw error;
    }
  } catch (error) {
    console.error("❌ Error in redirectToCheckout:", error);
    throw error;
  }
}

// Export utility functions and types
export { formatAmountForStripe, formatAmountFromStripe };
export type { Stripe, Product };
