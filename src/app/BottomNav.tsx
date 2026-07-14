'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    {/* Glassmorphism background with safe-area padding for mobile */}
    <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-between items-center h-16 z-[999] px-1 pb-safe">
      
      {/* Home */}
      <Link href="/feed" className={`flex flex-col items-center justify-center w-1/5 transition-colors ${pathname === '/feed' ? 'text-green-700' : 'text-slate-500 hover:text-green-600'}`}>
        <i className="bi bi-house-door text-xl mb-0.5"></i>
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      {/* Internship */}
      <Link href="/internships" className={`flex flex-col items-center justify-center w-1/5 transition-colors ${pathname === '/internships' ? 'text-green-700' : 'text-slate-500 hover:text-green-600'}`}>
        <i className="bi bi-briefcase text-xl mb-0.5"></i>
        <span className="text-[10px] font-medium">Internship</span>
      </Link>

      {/* 🚀 Center + Button (Upload) - Now perfectly rounded and un-squishable */}
      <div className="relative -top-5 flex justify-center w-1/5 shrink-0">
        <Link 
          href="/upload" 
          className="flex items-center justify-center w-14 h-14 bg-green-700 text-white rounded-full shadow-lg shadow-green-700/30 hover:bg-green-800 transition-transform active:scale-95"
        >
          <i className="bi bi-plus-lg text-2xl"></i>
        </Link>
      </div>

      {/* Events */}
      <Link href="/events" className={`flex flex-col items-center justify-center w-1/5 transition-colors ${pathname === '/events' ? 'text-green-700' : 'text-slate-500 hover:text-green-600'}`}>
        <i className="bi bi-calendar-event text-xl mb-0.5"></i>
        <span className="text-[10px] font-medium">Event</span>
      </Link>

      {/* Settings */}
      <Link href="/settings" className={`flex flex-col items-center justify-center w-1/5 transition-colors ${pathname === '/settings' ? 'text-green-700' : 'text-slate-500 hover:text-green-600'}`}>
        <i className="bi bi-gear text-xl mb-0.5"></i>
        <span className="text-[10px] font-medium">Settings</span>
      </Link>

    </div>
  );
}
