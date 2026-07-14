'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-around items-center h-16 z-50">
      
      {/* Home Button */}
      <Link href="/feed" className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${pathname === '/feed' ? 'text-green-700' : 'text-slate-500 hover:text-green-600'}`}>
        <i className="bi bi-house-door-fill text-xl"></i>
      </Link>
      
      {/* Internship Button */}
      <Link href="/internships" className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${pathname === '/internships' ? 'text-green-700' : 'text-slate-500 hover:text-green-600'}`}>
        <i className="bi bi-briefcase-fill text-xl"></i>
      </Link>

      {/* 🚀 THE PLUS BUTTON (Links to Upload) */}
      <div className="relative -top-5">
        <Link 
          href="/upload" 
          className="flex items-center justify-center w-14 h-14 bg-green-700 text-white rounded-full shadow-lg shadow-green-700/30 hover:bg-green-800 transition-transform active:scale-95"
        >
          <i className="bi bi-plus-lg text-2xl"></i>
        </Link>
      </div>

      {/* Events Button */}
      <Link href="/events" className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${pathname === '/events' ? 'text-green-700' : 'text-slate-500 hover:text-green-600'}`}>
        <i className="bi bi-calendar-event-fill text-xl"></i>
      </Link>

      {/* Settings Button */}
      <Link href="/settings" className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${pathname === '/settings' ? 'text-green-700' : 'text-slate-500 hover:text-green-600'}`}>
        <i className="bi bi-gear-fill text-xl"></i>
      </Link>

    </div>
  );
}

