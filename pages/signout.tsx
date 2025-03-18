import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';

type SignOutFormData = {
    name: string;
    phone: string;
};

const SignOutPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignOutFormData>();
    const router = useRouter();

    const onSubmit = async (data: SignOutFormData) => {
        try {
            const response = await fetch('/api/visitors/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to process sign-out');
            }

            // Redirect to success page
            router.push('/signout/success');
        } catch (error) {
            console.error('Sign-out error:', error);
            alert(error instanceof Error ? error.message : 'Failed to process sign-out');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Visitor Sign-Out</h1>
                <Link href="/" className="text-blue-500 hover:text-blue-600">
                    Back to Home
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register('name', { required: true })}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <span className="text-red-500 text-base mt-1">Name is required</span>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            {...register('phone', { required: true })}
                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && <span className="text-red-500 text-base mt-1">Phone number is required</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-4 text-xl bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Sign Out
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignOutPage; 