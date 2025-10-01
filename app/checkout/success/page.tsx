import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { retrieveCheckoutSession } from "@/app/lib/checkout-sessions";

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  let session = null;

  if (sessionId) {
    try {
      session = await retrieveCheckoutSession(sessionId);
    } catch (error) {
      console.error("Error retrieving session:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and will be
          processed shortly.
        </p>

        {session && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-2">Order Details:</h3>
            <p className="text-sm text-gray-600">
              <strong>Session ID:</strong> {session.id}
            </p>
            {session.customer_email && (
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {session.customer_email}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Amount:</strong> $
              {(session.amount_total! / 100).toFixed(2)}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard/products"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors inline-block"
          >
            Continue Shopping
          </Link>

          <Link
            href="/dashboard"
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors inline-block"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
