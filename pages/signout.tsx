import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';

type FormData = {
  name: string;
  phone: string;
};

const SignOut = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGoodbye, setShowGoodbye] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const router = useRouter();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  
  const onSignOut = async (data: FormData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/visits/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign out');
      }
      
      setSuccess('Sign-out successful!');
      setVisitorName(data.name);
      
      // Show goodbye popup
      setShowGoodbye(true);
      
      // Reset form
      reset();
      
      // Redirect to home after 5 seconds
      setTimeout(() => {
        router.push('/');
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Visitor Sign-Out
          </h1>
          <Link href="/" className="text-primary-600 hover:text-primary-800">
            Back to Home
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {success && !showGoodbye && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-green-700">{success}</p>
              </div>
            )}
            
            {/* Goodbye Popup */}
            {showGoodbye && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 animate-fade-in">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a2.5 2.5 0 015 0v6a2.5 2.5 0 01-5 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Goodbye, {visitorName}!</h2>
                    <p className="text-gray-600 mb-4">Thank you for your visit. You have been successfully signed out.</p>
                    <p className="text-gray-600 mb-6">We hope to see you again soon!</p>
                    <p className="text-gray-500 text-sm">Redirecting to home page in 5 seconds...</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <form onSubmit={handleSubmit(onSignOut)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="label">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input input-lg"
                    placeholder="Enter your full name"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-red-600 text-sm">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="label">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="input input-lg"
                    placeholder="Enter your phone number"
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-red-600 text-sm">{errors.phone.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full mt-6"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Sign Out'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignOut; 