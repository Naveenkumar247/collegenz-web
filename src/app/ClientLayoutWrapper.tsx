'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🟢 TOP HEADER (Restored) */}
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-[#228B22] text-white flex items-center justify-between px-6 z-[1050] shadow-sm">
        <h1 className="font-bold text-xl">
          <Link href="/feed" className="text-white no-underline">CollegenZ</Link>
        </h1>
        <div className="flex items-center gap-5 text-xl">
          <Link href="/notifications"><i className="bi bi-bell"></i></Link>
          <Link href="/messages"><i className="bi bi-chat-dots"></i></Link>
          <Link href="/profile"><i className="bi bi-person-circle"></i></Link>
        </div>
      </header>

      {/* 📱 MAIN CONTENT (Padded to fit between header and footer) */}
      <main className="flex-grow pt-[60px] pb-[64px] w-full">
        {children}
      </main>

      {/* 🟢 MOBILE BOTTOM NAV (Restored) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#cbd5e1] shadow-[0_-2px_8px_rgba(0,0,0,0.06)] z-[1050] flex justify-around items-center">
        <Link href="/feed" className={`flex flex-col items-center justify-center ${pathname === '/feed' ? 'text-[#228B22]' : 'text-[#64748b]'}`}>
          <i className="bi bi-house-door text-2xl"></i>
          <span className="text-[10px]">Home</span>
        </Link>
        
        <Link href="/internships" className="flex flex-col items-center justify-center text-[#64748b]">
          <i className="bi bi-briefcase text-2xl"></i>
          <span className="text-[10px]">Internship</span>
        </Link>
        
        {/* Floating Upload Button */}
        <div className="relative -top-5">
          <Link href="/upload" className="w-14 h-14 bg-[#228B22] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <i className="bi bi-plus-lg text-2xl"></i>
          </Link>
        </div>

        <Link href="/events" className="flex flex-col items-center justify-center text-[#64748b]">
          <i className="bi bi-calendar-check text-2xl"></i>
          <span className="text-[10px]">Event</span>
        </Link>
        
        <Link href="/settings" className={`flex flex-col items-center justify-center ${pathname === '/settings' ? 'text-[#228B22]' : 'text-[#64748b]'}`}>
          <i className="bi bi-gear text-2xl"></i>
          <span className="text-[10px]">Settings</span>
        </Link>
      </nav>
    </div>
  );
          }

