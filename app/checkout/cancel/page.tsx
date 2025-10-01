import Link from "next/link";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>

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

        <div className="mt-6 text-sm text-gray-500">
          <p>Need help? <a href="#" className="text-indigo-600 hover:text-indigo-500">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
}