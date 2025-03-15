import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

type Visit = {
  id: number;
  visitorId: number;
  signInTime: string;
  signOutTime: string | null;
  hostName: string | null;
  notes: string | null;
  visitor: {
    id: number;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    type: string;
    visitPurpose: string;
  };
};

const Admin = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/visits');
      if (!response.ok) {
        throw new Error('Failed to fetch visits');
      }
      const data = await response.json();
      setVisits(data);
    } catch (err) {
      setError('Failed to load visitor data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSignOut = async (visitId: number) => {
    try {
      const response = await fetch(`/api/visits/${visitId}/signout`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to sign out visitor');
      }
      
      // Refresh the visits data
      fetchVisits();
    } catch (err) {
      setError('Failed to sign out visitor');
      console.error(err);
    }
  };

  const filteredVisits = visits.filter((visit) => {
    // Filter by status
    if (filter === 'active' && visit.signOutTime) return false;
    if (filter === 'completed' && !visit.signOutTime) return false;
    
    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      visit.visitor.name.toLowerCase().includes(searchLower) ||
      (visit.visitor.company && visit.visitor.company.toLowerCase().includes(searchLower)) ||
      (visit.visitor.email && visit.visitor.email.toLowerCase().includes(searchLower)) ||
      (visit.visitor.phone && visit.visitor.phone.toLowerCase().includes(searchLower)) ||
      (visit.hostName && visit.hostName.toLowerCase().includes(searchLower));
    
    if (searchTerm && !matchesSearch) return false;
    
    // Filter by date
    if (dateFilter) {
      const visitDate = new Date(visit.signInTime).toISOString().split('T')[0];
      if (visitDate !== dateFilter) return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <Link href="/" className="text-primary-600 hover:text-primary-800">
            Back to Home
          </Link>
        </div>
      </header>
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Visitor Log</h2>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, company, email..."
                    className="input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="sm:w-48">
                  <select
                    className="input"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                  >
                    <option value="all">All Visits</option>
                    <option value="active">Active Visits</option>
                    <option value="completed">Completed Visits</option>
                  </select>
                </div>
                
                <div className="sm:w-48">
                  <input
                    type="date"
                    className="input"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mb-4">
                <button
                  onClick={fetchVisits}
                  className="btn btn-secondary"
                >
                  Refresh Data
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Loading visitor data...</p>
                </div>
              ) : filteredVisits.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No visitor records found.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visitor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sign In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sign Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Host
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVisits.map((visit) => (
                      <tr key={visit.id} className={!visit.signOutTime ? "bg-yellow-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {visit.visitor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {visit.visitor.company || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {visit.visitor.phone || 'No phone'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            visit.visitor.type === 'Contractor' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {visit.visitor.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(visit.signInTime), 'MMM d, yyyy h:mm a')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {visit.signOutTime 
                            ? format(new Date(visit.signOutTime), 'MMM d, yyyy h:mm a')
                            : 'Not signed out'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {visit.hostName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {visit.visitor.visitPurpose}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {!visit.signOutTime && (
                            <button
                              onClick={() => handleManualSignOut(visit.id)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Sign Out
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin; 