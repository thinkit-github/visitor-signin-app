import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

type Visitor = {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string | null;
    hostName: string;
    purpose: string;
    signature: string;
    signInTime: string;
    signOutTime: string | null;
    isSignedOut: boolean;
    notes?: string;
    visitorType: string;
};

const AdminDashboard: React.FC = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [visitStatus, setVisitStatus] = useState('all');

    const fetchVisitors = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/visitors');
            
            if (!response.ok) {
                throw new Error('Failed to fetch visitors');
            }
            
            const data = await response.json();
            setVisitors(data);
        } catch (err) {
            console.error('Error fetching visitors:', err);
            setError('Failed to load visitor data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const handleSignOut = async (visitorId: number) => {
        try {
            const response = await fetch(`/api/visitors/${visitorId}/signout`, {
                method: 'PUT',
            });
            
            if (!response.ok) {
                throw new Error('Failed to sign out visitor');
            }
            
            // Refresh the visitor list
            fetchVisitors();
        } catch (error) {
            console.error('Error signing out visitor:', error);
            alert('Failed to sign out visitor. Please try again.');
        }
    };

    const filteredVisitors = visitors.filter(visitor => {
        const matchesSearch = 
            visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visitor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visitor.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDate = !filterDate || 
            format(new Date(visitor.signInTime), 'yyyy-MM-dd') === filterDate;
        
        const matchesStatus = visitStatus === 'all' ||
            (visitStatus === 'current' && !visitor.isSignedOut) ||
            (visitStatus === 'past' && visitor.isSignedOut);
        
        return matchesSearch && matchesDate && matchesStatus;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Link href="/" className="text-blue-500 hover:text-blue-600">
                    Back to Home
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Visitor Log</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, company, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                    />
                    
                    <select
                        value={visitStatus}
                        onChange={(e) => setVisitStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="all">All Visits</option>
                        <option value="current">Current Visitors</option>
                        <option value="past">Past Visitors</option>
                    </select>
                    
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                    />
                    
                    <button
                        onClick={() => fetchVisitors()}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Refresh Data
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left">Name</th>
                                    <th className="px-6 py-3 text-left">Company</th>
                                    <th className="px-6 py-3 text-left">Host</th>
                                    <th className="px-6 py-3 text-left">Purpose</th>
                                    <th className="px-6 py-3 text-left">Sign In Time</th>
                                    <th className="px-6 py-3 text-left">Sign Out Time</th>
                                    <th className="px-6 py-3 text-left">Signature</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVisitors.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                            No visitor records found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVisitors.map((visitor) => (
                                        <tr key={visitor.id} className="border-b">
                                            <td className="px-6 py-4">{visitor.name}</td>
                                            <td className="px-6 py-4">{visitor.company || 'N/A'}</td>
                                            <td className="px-6 py-4">{visitor.hostName}</td>
                                            <td className="px-6 py-4">{visitor.purpose}</td>
                                            <td className="px-6 py-4">
                                                {format(new Date(visitor.signInTime), 'PPpp')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {visitor.signOutTime 
                                                    ? format(new Date(visitor.signOutTime), 'PPpp')
                                                    : 'Not signed out'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {visitor.signature ? (
                                                    <img 
                                                        src={visitor.signature} 
                                                        alt="Signature" 
                                                        className="h-12 max-w-xs object-contain"
                                                    />
                                                ) : 'No signature'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {!visitor.isSignedOut && (
                                                    <button
                                                        onClick={() => handleSignOut(visitor.id)}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    >
                                                        Sign Out
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard; 