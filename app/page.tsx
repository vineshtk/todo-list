import Link from "next/link";

export default function AgreementPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Terms of Service
        </h1>
        <div className="prose prose-gray dark:prose-invert">
          <p>
            Welcome to our to-do list application! Before you get started, please
            read and agree to our terms of service.
          </p>
          <p>
            By using this application, you agree to be bound by these terms. If
            you do not agree to these terms, you may not use the application.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
            1. Your Content
          </h2>
          <p>
            You are responsible for the content you create and store in this
            application. We do not claim ownership of your content.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
            2. Prohibited Use
          </h2>
          <p>
            You may not use this application for any illegal or unauthorized
            purpose. You must not, in the use of the Service, violate any laws in
            your jurisdiction.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
            3. Changes to the Service
          </h2>
          <p>
            We reserve the right to modify or discontinue the service at any
            time without notice.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/todos"
            className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            I Agree
          </Link>
        </div>
      </div>
    </div>
  );
}
