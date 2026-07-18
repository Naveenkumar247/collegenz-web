// src/app/event/saved/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SavedEventPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust based on how you store your JWT
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://collegenz-api.onrender.com/api/v1'}/posts/saved-events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch saved events');
        }
      } catch (error) {
        console.error('Error fetching saved events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center font-sans">
        <div className="animate-spin w-6 h-6 border-2 border-emerald-700 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 🟢 Empty State (Using your exact placeholder design)
  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center font-sans relative">
        {/* Back Button for empty state */}
        <button 
          onClick={() => router.back()} 
          className="absolute top-6 left-4 text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors"
        >
          ← Back
        </button>

        <div className="text-center space-y-2 max-w-xs bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
          <span className="text-2xl">📅</span>
          <h1 className="text-sm font-bold text-slate-800">Event Hub</h1>
          <p className="text-xs text-slate-400">Track upcoming campus hackathons and tech symposiums soon.</p>
        </div>
      </div>
    );
  }

  // 🟢 Populated State (When user has saved events)
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-slate-200 px-4 py-4 flex items-center shadow-sm">
        <button onClick={() => router.back()} className="mr-4 text-slate-600 text-xl font-bold">
          ←
        </button>
        <h1 className="text-lg font-bold text-slate-900">Saved Events</h1>
      </div>

      {/* Events Feed */}
      <div className="max-w-2xl mx-auto p-4 space-y-4 mt-4">
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-md">
                Upcoming Event
              </span>
              <span className="text-xs text-slate-400">
                {new Date(event.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              {event.title || 'Campus Event'}
            </h2>
            
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
              {event.content || event.description || 'No description provided.'}
            </p>

            {event.images && event.images.length > 0 && (
              <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-slate-100">
                <img 
                  src={event.images[0]} 
                  alt="Event Cover" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            
            <button 
              onClick={() => router.push(`/post/${event._id}`)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium py-2 rounded-xl transition-colors text-sm"
            >
              View Event Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
