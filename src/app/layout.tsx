import React from 'react';
import './globals.css';
import Link from 'next/link';
// Assuming you move your navigation logic here or keep it as a shared component

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
      <body className="bg-slate-50 antialiased text-slate-900">
        {/* Your Sidebar/Header/BottomNav components should be placed here */}
        <main>{children}</main>
      </body>
    </html>
  );
}
