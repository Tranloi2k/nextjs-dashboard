import { NextRequest } from "next/server";
import { handleStripeWebhook } from "@/app/lib/checkout-sessions";

export async function POST(request: NextRequest) {
  return handleStripeWebhook(request);
}