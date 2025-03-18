import React from 'react';
import Link from 'next/link';

const SignOutSuccess: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        
        <h1 className="text-2xl font-bold mt-4 mb-2">Sign-Out Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for visiting. Have a great day!
        </p>
        
        <Link href="/" className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default SignOutSuccess; 