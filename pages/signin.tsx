import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import SignaturePad from 'signature_pad';
import Link from 'next/link';

type FormData = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  hostName: string;
  purpose: string;
  notes?: string;
  visitorType: string;
};

const SignInForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const signaturePadRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
    const [signatureError, setSignatureError] = useState(false);
    const router = useRouter();

    // Initialize signature pad on component mount with proper sizing
    useEffect(() => {
        if (signaturePadRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext('2d')?.scale(ratio, ratio);

            const pad = new SignaturePad(canvas, {
                backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background
                penColor: 'rgb(0, 0, 0)',
                minWidth: 1,
                maxWidth: 2.5
            });
            setSignaturePad(pad);
        }
    }, []);

    const onSubmit = async (data: FormData) => {
        if (!signaturePad || signaturePad.isEmpty()) {
            setSignatureError(true);
            return;
        }
        
        setSignatureError(false);
        
        try {
            const signatureData = signaturePad.toDataURL('image/png', 1.0);
            
            const visitorData = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                company: data.company || '',
                hostName: data.hostName,
                purpose: data.purpose,
                signature: signatureData,
                notes: data.notes || '',
                visitorType: data.visitorType || 'Visitor',
            };
            
            console.log('Submitting visitor data:', visitorData);
            
            const response = await fetch('/api/visitors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitorData),
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.details || responseData.error || 'Failed to submit');
            }
            
            // If successful, redirect
            router.push('/signin/success');
        } catch (error) {
            console.error('Error submitting visitor data:', error);
            alert(error instanceof Error ? error.message : 'Failed to save visitor information. Please try again.');
        }
    };

    const clearSignature = () => {
        if (signaturePad) {
            signaturePad.clear();
            setSignatureError(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Visitor Sign-In</h1>
                <Link href="/" className="text-blue-500 hover:text-blue-600">
                    Back to Home
                </Link>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            {...register('name', { required: true })}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <span className="text-red-500 text-base mt-1">Name is required</span>}
                    </div>

                    {/* Company */}
                    <div>
                        <label htmlFor="company" className="block text-lg font-medium text-gray-700 mb-2">
                            Company
                        </label>
                        <input
                            id="company"
                            type="text"
                            placeholder="Enter your company name"
                            {...register('company')}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email - Full Width on Its Own Row */}
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email', { required: true })}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <span className="text-red-500 text-base mt-1">Email is required</span>}
                    </div>

                    {/* Phone Number - Full Width on Its Own Row */}
                    <div>
                        <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            {...register('phone', { required: true })}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && <span className="text-red-500 text-base mt-1">Phone number is required</span>}
                    </div>

                    {/* Purpose of Visit */}
                    <div>
                        <label htmlFor="purpose" className="block text-lg font-medium text-gray-700 mb-2">
                            Purpose of Visit <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="purpose"
                            type="text"
                            placeholder="Enter the purpose of your visit"
                            {...register('purpose', { required: true })}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.purpose && <span className="text-red-500 text-base mt-1">Purpose is required</span>}
                    </div>

                    {/* Visitor Type */}
                    <div>
                        <label htmlFor="visitorType" className="block text-lg font-medium text-gray-700 mb-2">
                            Visitor Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="visitorType"
                            {...register('visitorType', { required: true })}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Visitor">Visitor</option>
                            <option value="Contractor">Contractor</option>
                            <option value="Delivery">Delivery</option>
                            <option value="Interview">Interview</option>
                        </select>
                        {errors.visitorType && <span className="text-red-500 text-base mt-1">Visitor type is required</span>}
                    </div>

                    {/* Person you are visiting (was Host Name) */}
                    <div>
                        <label htmlFor="hostName" className="block text-lg font-medium text-gray-700 mb-2">
                            Person you are visiting
                        </label>
                        <input
                            id="hostName"
                            type="text"
                            placeholder="Who are you visiting?"
                            {...register('hostName', { required: true })}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.hostName && <span className="text-red-500 text-base mt-1">Host name is required</span>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-lg font-medium text-gray-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            placeholder="Any additional information"
                            {...register('notes')}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        />
                    </div>

                    {/* Signature */}
                    <div>
                        <label htmlFor="signature" className="block text-lg font-medium text-gray-700 mb-2">
                            Signature <span className="text-red-500">*</span>
                        </label>
                        <div 
                            ref={signaturePadRef}
                            className="border border-gray-300 rounded-md p-2 h-48 relative"
                            style={{ touchAction: 'none' }}
                        >
                            <canvas 
                                ref={canvasRef}
                                className="w-full h-full"
                                style={{ 
                                    width: '100%', 
                                    height: '100%',
                                    cursor: 'crosshair',
                                }}
                            />
                            <button 
                                type="button" 
                                onClick={clearSignature}
                                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Clear
                            </button>
                        </div>
                        {signatureError && <span className="text-red-500 text-base mt-1">Signature is required</span>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            className="px-8 py-4 text-xl bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignInForm; 