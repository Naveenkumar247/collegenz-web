'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Header only shows on the root path ('/')
  const isHomePage = pathname === '/feed';

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* 🟢 TOP HEADER: Conditionally rendered only on Home */}
      {isHomePage && (
        <header className="fixed top-0 left-0 right-0 h-[60px] bg-[#228B22] text-white flex items-center justify-between px-6 z-[1050] shadow-sm">
          <h1 className="font-bold text-xl">
            <Link href="/aboutus" className="text-white no-underline">CollegenZ</Link>
          </h1>
          <div className="flex items-center gap-5 text-xl">
            <Link href="/notifications"><i className="bi bi-bell"></i></Link>
            <Link href="/profile"><i className="bi bi-person-circle"></i></Link>
          </div>
        </header>
      )}

      {/* 📱 DYNAMIC CONTENT: 
          If isHomePage is true, add pt-[60px] to push content below the header.
          If isHomePage is false, use pt-0 so content starts at the very top. */}
      <main className={`flex-grow w-full pb-20 ${isHomePage ? 'pt-[60px]' : 'pt-0'}`}>
        {children}
      </main>

      {/* 🟢 BOTTOM NAV: Always visible, outside the conditional block */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#cbd5e1] z-[1050] flex justify-around items-center">
        <Link href="/" className={pathname === '/' ? 'text-[#228B22]' : 'text-[#64748b]'}>
          <i className="bi bi-house-door text-2xl"></i>
        </Link>
        <Link href="/internships" className={pathname === '/internships' ? 'text-[#228B22]' : 'text-[#64748b]'}>
          <i className="bi bi-briefcase text-2xl"></i>
        </Link>
        <div className="relative -top-5">
          <Link href="/upload" className="w-14 h-14 bg-[#228B22] text-white rounded-full flex items-center justify-center shadow-lg">
            <i className="bi bi-plus-lg text-2xl"></i>
          </Link>
        </div>
        <Link href="/event" className={pathname === '/events' ? 'text-[#228B22]' : 'text-[#64748b]'}>
          <i className="bi bi-calendar-check text-2xl"></i>
        </Link>
        <Link href="/settings" className={pathname === '/settings' ? 'text-[#228B22]' : 'text-[#64748b]'}>
          <i className="bi bi-gear text-2xl"></i>
        </Link>
      </nav>
    </div>
  );
}
