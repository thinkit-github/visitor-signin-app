import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-8">
          Visitor Sign-In System
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link href="/signin" className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col items-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Sign In</h2>
              <p className="text-gray-600">Register your arrival</p>
            </div>
          </Link>
          
          <Link href="/signout" className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col items-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Sign Out</h2>
              <p className="text-gray-600">Register your departure</p>
            </div>
          </Link>
        </div>
        
        <div className="mb-4">
          <Link href="/admin" className="text-sm text-primary-600 hover:text-primary-800 hover:underline">
            Admin Panel
          </Link>
        </div>
        
        <footer className="text-gray-500">
          <p>© {new Date().getFullYear()} Visitor Sign-In App</p>
        </footer>
      </div>
    </div>
  );
};

export default Home; 