import React from 'react'; // 🟢 FIXED: Lowercase 'i'
import './globals.css';

export const metadata = {
  title: 'CollegenZ',
  description: 'Enterprise AI-Powered Student Hub Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 🟢 FIXED: Removed "dark" class to match your clean, white UI screenshots
    <html lang="en"> 
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" 
        />
      </head>
      {/* 🟢 FIXED: Light background, and added pb-16 so content doesn't hide behind the navbar */}
      <body className="bg-slate-50 antialiased text-slate-900 pb-16">
        {children}
        
        {/* This injects your bottom navigation across the entire app */}
        <BottomNav /> 
      </body>
    </html>
  );
}
