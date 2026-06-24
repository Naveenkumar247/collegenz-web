import React from 'react';
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
    <html lang="en" className="dark">
      <head>
        {/* 🚀 High-speed global vector font injection stream */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" 
        />
      </head>
      <body className="bg-slate-950 antialiased selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
