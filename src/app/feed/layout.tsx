'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarItems = [
    { label: 'Home', path: '/feed', icon: 'bi-house-door' },
    { label: 'Community Hubs', path: '/community', icon: 'bi-people' },
    { label: 'Courses', path: '/courses', icon: 'bi-journal-text' },
    { label: 'Internships', path: '/internships', icon: 'bi-briefcase' },
    { label: 'Placements', path: '/placements', icon: 'bi-building' },
    { label: 'Events', path: '/events', icon: 'bi-calendar-check' },
    { label: 'Crypto Wallet', path: '/wallet', icon: 'bi-currency-bitcoin' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9] text-[#1e293b] antialiased">
      
      {/* 🟢 Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-[#228B22] text-white flex items-center justify-between px-6 z-[1050] shadow-sm">
        <h1 className="font-['Poppins'] font-bold text-xl tracking-wide">
          <Link href="/feed" className="text-white no-underline">CollegenZ</Link>
        </h1>
        
        <div className="flex items-center gap-5">
          <Link href="/notifications" className="text-white text-xl relative no-underline">
            <i className="bi bi-bell"></i>
            <span className="absolute -top-[5px] -right-[8px] text-[10px] bg-red-600 text-white font-bold rounded-full px-1.5 py-0.5">5</span>
          </Link>
          <Link href="/messages" className="text-white text-xl relative no-underline">
            <i className="bi bi-chat-dots"></i>
          </Link>
          <Link href="/profile" className="text-white text-xl no-underline">
            <i className="bi bi-person-circle"></i>
          </Link>
        </div>
      </header>

      {/* 👥 Primary Frame Workspace */}
      <div className="flex pt-[60px] h-[calc(100vh-60px)] w-full">
        
        {/* 💻 Left Sidebar Navigation (Desktop Viewports Only) */}
        <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-[#cbd5e1] py-4 flex-shrink-0 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3.5 px-6 py-3 no-underline font-['Poppins'] font-medium text-[0.95rem] border-l-4 transition-all duration-150 ${
                  isActive 
                    ? 'bg-[#f0fdf4] text-[#228B22] border-l-[#228B22]' 
                    : 'text-[#475569] border-l-transparent hover:bg-[#f8fafc] hover:text-[#228B22]'
                }`}
              >
                <i className={`bi ${item.icon} text-lg`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <hr className="border-t border-[#cbd5e1] my-3 mx-4" />
          <Link href="/settings" className="flex items-center gap-3.5 px-6 py-3 no-underline font-['Poppins'] font-medium text-[0.95rem] text-[#475569] hover:bg-[#f8fafc]">
            <i className="bi bi-gear text-lg"></i>
            <span>Settings</span>
          </Link>
        </aside>

        {/* 📱 Dynamic Scroll Workspace Dashboard Viewport Area */}
        <main className="flex-grow p-4 lg:p-6 overflow-y-auto pb-[90px] lg:pb-6">
          {children}
        </main>
      </div>

      {/* 📱 Mobile Bottom Sticky Tab Bar Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#cbd5e1] shadow-[0_-2px_8px_rgba(0,0,0,0.06)] z-[1050] flex justify-around items-center pb-safe">
        <Link href="/feed" className={`flex flex-col items-center justify-center text-[0.72rem] font-medium font-['Poppins'] flex-1 h-full no-underline ${pathname === '/feed' ? 'text-[#228B22]' : 'text-[#64748b]'}`}>
          <i className="bi bi-house-door text-2xl mb-0.5"></i>
          <span>Home</span>
        </Link>
        <Link href="/internships" className="flex flex-col items-center justify-center text-[0.72rem] font-medium font-['Poppins'] flex-1 h-full text-[#64748b] no-underline">
          <i className="bi bi-briefcase text-2xl mb-0.5"></i>
          <span>Internship</span>
        </Link>
        
        {/* Central Floating Action Post Button */}
        <div className="relative flex-1 flex justify-center items-center h-full">
          <Link href="/upload" className="absolute -top-[18px] w-13 h-13 bg-[#228B22] text-white rounded-full flex items-center justify-center text-xl shadow-[0_4px_10px_rgba(34,139,34,0.35)] no-underline active:scale-95 transition-transform">
            <i className="bi bi-plus-lg"></i>
          </Link>
        </div>

        <Link href="/events" className="flex flex-col items-center justify-center text-[0.72rem] font-medium font-['Poppins'] flex-1 h-full text-[#64748b] no-underline">
          <i className="bi bi-calendar-check text-2xl mb-0.5"></i>
          <span>Event</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center justify-center text-[0.72rem] font-medium font-['Poppins'] flex-1 h-full text-[#64748b] no-underline">
          <i className="bi bi-gear text-2xl mb-0.5"></i>
          <span>Settings</span>
        </Link>
      </nav>

    </div>
  );
}

