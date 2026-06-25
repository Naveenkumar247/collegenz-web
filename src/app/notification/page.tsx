'use client';

import React from 'react';

export default function NotificationDummyPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center font-sans px-4">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        
        {/* Header Layout */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 font-bold border border-amber-100">
            🔔
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">Activity Stream</h1>
            <p className="text-[11px] text-slate-400">Application and push interaction tracking hubs</p>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Dummy Notification Items List Stack */}
        <div className="space-y-2">
          <div className="flex items-start space-x-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100 text-xs">
            <span className="mt-0.5">🚀</span>
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-800">System Gateway Connected Successfully</p>
              <p className="text-[10px] text-slate-400">Native Web Push validation links are operational.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100 text-xs opacity-60">
            <span>👥</span>
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-800">Community Synchronization Complete</p>
              <p className="text-[10px] text-slate-400">Your profile is synchronized across the database pool cluster.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

