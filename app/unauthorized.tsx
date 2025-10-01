import Link from "next/link";
import { HomeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Error Message */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center space-y-4">
            <LockClosedIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
            <p className="text-gray-600">
              You don't have permission to access this page. Please log in with
              valid credentials to continue.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <Link
              href="/login"
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <LockClosedIcon className="h-5 w-5 mr-2" />
              Sign In
            </Link>

            <Link
              href="/"
              className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Go Home
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
