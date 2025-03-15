import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  visitPurpose: string;
  type: 'Contractor' | 'Visitor';
  hostName: string;
  notes: string;
  signature: string;
};

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>();
  const name = watch('name');
  
  // Initialize canvas for signature
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        
        // Clear canvas
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add a light border
        ctx.strokeStyle = '#e5e7eb';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Reset stroke style for drawing
        ctx.strokeStyle = '#000';
      }
    }
  }, []);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Get position
    let x, y;
    if ('touches' in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get position
    let x, y;
    if ('touches' in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
      
      // Prevent scrolling when drawing
      e.preventDefault();
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const endDrawing = () => {
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Save signature as data URL
    const signatureData = canvas.toDataURL('image/png');
    setValue('signature', signatureData);
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a light border
    ctx.strokeStyle = '#e5e7eb';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Reset stroke style for drawing
    ctx.strokeStyle = '#000';
    
    // Clear signature value
    setValue('signature', '');
  };
  
  const onSignIn = async (data: FormData) => {
    // Check if signature is provided
    if (!data.signature) {
      setError('Please provide your signature');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/visits/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sign in');
      }
      
      setSuccess('Sign-in successful!');
      setVisitorName(data.name);
      
      // Show welcome popup
      setShowWelcome(true);
      
      // Reset form
      reset();
      clearSignature();
      
      // Redirect to home after 5 seconds
      setTimeout(() => {
        router.push('/');
      }, 5000);
    } catch (err) {
      setError('An error occurred. Please try again.');
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
            Visitor Sign-In
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
            
            {success && !showWelcome && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-green-700">{success}</p>
              </div>
            )}
            
            {/* Welcome Popup */}
            {showWelcome && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 animate-fade-in">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {visitorName}!</h2>
                    <p className="text-gray-600 mb-6">Your sign-in has been successfully recorded.</p>
                    <p className="text-gray-500 text-sm">Redirecting to home page in 5 seconds...</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <form onSubmit={handleSubmit(onSignIn)} className="space-y-4">
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
                  <label htmlFor="company" className="label">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    className="input input-lg"
                    placeholder="Enter your company name"
                    {...register('company')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="input input-lg"
                      placeholder="Enter your email"
                      {...register('email')}
                    />
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
                </div>
                
                <div>
                  <label htmlFor="visitPurpose" className="label">
                    Purpose of Visit *
                  </label>
                  <input
                    id="visitPurpose"
                    type="text"
                    className="input input-lg"
                    placeholder="Enter the purpose of your visit"
                    {...register('visitPurpose', { required: 'Purpose is required' })}
                  />
                  {errors.visitPurpose && (
                    <p className="mt-1 text-red-600 text-sm">{errors.visitPurpose.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="type" className="label">
                    Visitor Type *
                  </label>
                  <select
                    id="type"
                    className="input input-lg"
                    {...register('type', { required: 'Visitor type is required' })}
                  >
                    <option value="Visitor">Visitor</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-red-600 text-sm">{errors.type.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="hostName" className="label">
                    Host Name
                  </label>
                  <input
                    id="hostName"
                    type="text"
                    className="input input-lg"
                    placeholder="Who are you visiting?"
                    {...register('hostName')}
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="label">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    className="input input-lg"
                    rows={3}
                    placeholder="Any additional information"
                    {...register('notes')}
                  ></textarea>
                </div>
                
                {/* Signature Box */}
                <div>
                  <label htmlFor="signature" className="label">
                    Signature *
                  </label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={450}
                      height={150}
                      className="w-full bg-gray-50 touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={endDrawing}
                      onMouseLeave={endDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={endDrawing}
                    />
                  </div>
                  <input type="hidden" {...register('signature')} />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-gray-600 hover:text-gray-900"
                      onClick={clearSignature}
                    >
                      Clear Signature
                    </button>
                  </div>
                  <p className="mt-1 text-gray-500 text-sm">
                    Please sign using your mouse or finger
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full mt-6"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn; 