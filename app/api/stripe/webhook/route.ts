import { NextRequest } from "next/server";
import { handleStripeWebhook } from "@/app/lib/checkout-sessions";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  return handleStripeWebhook(request);
}