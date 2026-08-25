import React, { useEffect, useState } from 'react';
import { reviewService } from '../services/reviewService';
import { ReviewData } from '../types';
import { Trash2, RefreshCw, Sparkles, LogOut, Search, Eye, EyeOff } from 'lucide-react';
import { validateWhatsApp } from '../utils/validation';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'MeetMosaicReviews' && password === 'Reviews@MeetMosaic') {
      setIsAuthenticated(true);
      fetchReviews();
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getReviews();
      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(id);
        setReviews(reviews.filter(r => r.id !== id));
      } catch (error) {
        alert('Failed to delete review');
      }
    }
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-review');
      if (!response.ok) throw new Error('Failed to generate mock review');
      const mockData = await response.json();
      
      // Submit it to Firebase
      await reviewService.submitReview(mockData);
      // Refresh list
      await fetchReviews();
    } catch (error) {
      console.error('Error generating AI review:', error);
      alert('Failed to generate review. Ensure the server is running.');
    } finally {
      setGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500 mt-2">Meet Mosaic Review Portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-11 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-md transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            
            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-medium py-3 rounded-xl hover:bg-purple-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.whatsappNumber.includes(searchTerm) ||
      r.testimonial?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEvent ? r.event === filterEvent : true;
    return matchesSearch && matchesFilter;
  });

  // Unique events for filter
  const events = Array.from(new Set(reviews.map(r => r.event))).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Meet Mosaic Admin</h1>
          <p className="text-sm text-gray-500">Reviews Dashboard</p>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-xl w-full sm:w-64 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="px-4 py-2 border rounded-xl focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Events</option>
              {events.map(event => (
                <option key={event} value={event}>{event}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchReviews}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleGenerateAI}
              disabled={generating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? 'Generating...' : 'Seed AI Review'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Name / Contact</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Testimonial</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      {loading ? 'Loading reviews...' : 'No reviews found.'}
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {review.submittedAt ? new Date(review.submittedAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{review.name || 'Anonymous'}</div>
                        <div className="text-gray-500 text-xs mt-1">{review.whatsappNumber}</div>
                        <div className="text-gray-500 text-xs">{review.mailId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {review.event}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 font-bold">★</span>
                          <span>{review.overallRating}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate" title={review.testimonial}>
                        {review.testimonial || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => review.id && handleDelete(review.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
