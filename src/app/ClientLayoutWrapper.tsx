'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Condition: Only show the top header if the path is exactly '/'
  const isHomePage = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* 🟢 TOP HEADER (Conditional: Only Home) */}
      {isHomePage && (
        <header className="fixed top-0 left-0 right-0 h-[60px] bg-[#228B22] text-white flex items-center justify-between px-6 z-[1050] shadow-sm">
          <h1 className="font-bold text-xl">
            <Link href="/" className="text-white no-underline">CollegenZ</Link>
          </h1>
          <div className="flex items-center gap-5 text-xl">
            <Link href="/notifications"><i className="bi bi-bell"></i></Link>
            <Link href="/profile"><i className="bi bi-person-circle"></i></Link>
          </div>
        </header>
      )}

      {/* 📱 DYNAMIC CONTENT (Dynamic padding) */}
      <main className={`flex-grow w-full pb-[64px] ${isHomePage ? 'pt-[60px]' : 'pt-0'}`}>
        {children}
      </main>

      {/* 🟢 BOTTOM NAV (Global: Always visible) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#cbd5e1] z-[1050] flex justify-around items-center">
        <Link href="/" className={pathname === '/' ? 'text-[#228B22]' : 'text-[#64748b]'}>
           <i className="bi bi-house-door text-2xl"></i>
        </Link>
        {/* ... add your other links here ... */}
      </nav>
    </div>
  );
}
