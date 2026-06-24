import React from 'react';
import './globals.css'; // This loads your global Tailwind styles

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
      <body className="bg-slate-950 antialiased selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}

