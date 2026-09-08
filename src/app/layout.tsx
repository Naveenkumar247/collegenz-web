import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutWrapper from './ClientLayoutWrapper';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.collegenz.in'),

  title: {
    default: 'CollegenZ – AI-Powered Student Platform',
    template: '%s | CollegenZ',
  },

  description:
    'CollegenZ is an AI-powered student platform to connect with students, discover opportunities, explore careers, build skills, and grow together.',

  keywords: [
    'CollegenZ',
    'college students',
    'student platform',
    'student community',
    'college community',
    'student opportunities',
    'career opportunities',
    'AI student platform',
    'college networking',
    'student networking',
  ],

  authors: [
    {
      name: 'CollegenZ',
      url: 'https://www.collegenz.in',
    },
  ],

  creator: 'CollegenZ',
  publisher: 'CollegenZ',

  alternates: {
    canonical: 'https://www.collegenz.in/',
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.collegenz.in/',
    siteName: 'CollegenZ',
    title: 'CollegenZ – AI-Powered Student Platform',
    description:
      'Connect with students, discover opportunities, explore careers, build skills, and grow together with CollegenZ.',
  },

  twitter: {
    card: 'summary',
    title: 'CollegenZ – AI-Powered Student Platform',
    description:
      'Connect, learn, discover opportunities and grow with CollegenZ.',
  },

  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>

      <body className="bg-[#f4f6f9] antialiased text-[#1e293b]">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
