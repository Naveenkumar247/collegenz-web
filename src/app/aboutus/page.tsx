'use client';
import React from 'react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-800">About Us</h1>
          <div className="h-1 w-20 bg-emerald-600 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About Content */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Our Story</h2>
            <p className="text-slate-600 leading-relaxed">
              Welcome to <strong>CollegenZ</strong> — a student-driven platform built to connect learners, 
              opportunities, and ideas. Our goal is to make college communities smarter by sharing 
              information, internships, and creative projects through a single hub.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-emerald-700 p-8 rounded-2xl shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="opacity-90 leading-relaxed">
              Built by students, for students. Because your college life deserves its own 
              dedicated, noise-free space for digital innovation and collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
