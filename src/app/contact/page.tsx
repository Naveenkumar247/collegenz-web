'use client';
import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Get in Touch</h1>
        <p className="text-slate-500 mb-8">Have questions? We'd love to hear from you.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Card */}
          <a href="mailto:naveenkumar@collegenz.in" 
             className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all shadow-sm hover:shadow-md">
            <h3 className="font-bold text-emerald-900">Email Us</h3>
            <p className="text-sm text-slate-600 mt-1">naveenkumar@collegenz.in</p>
          </a>

          {/* Website Card */}
          <a href="https://www.collegenz.in" target="_blank"
             className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all shadow-sm hover:shadow-md">
            <h3 className="font-bold text-emerald-900">Visit Website</h3>
            <p className="text-sm text-slate-600 mt-1">www.collegenz.in</p>
          </a>
        </div>
      </div>
    </div>
  );
}
