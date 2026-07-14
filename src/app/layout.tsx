import React from 'react';
import './globals.css';
import Link from 'next/link';
import ClientLayoutWrapper from './ClientLayoutWrapper'; // See Step 2 below

export const metadata = {
  title: 'CollegenZ',
  description: 'Enterprise AI-Powered Student Hub Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" 
        />
      </head>
      <body className="bg-[#f4f6f9] antialiased text-[#1e293b]">
        {/* We use a Client Wrapper to handle the 'use client' hooks like usePathname */}
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
