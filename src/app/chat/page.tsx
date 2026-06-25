'use client';

import React from 'react';

export default function ChatDummyPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center font-sans px-4">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        
        {/* Header Layout */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold border border-indigo-100">
            💬
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">Messaging Hub</h1>
            <p className="text-[11px] text-slate-400">Real-time cross-origin socket connection stream</p>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Dummy Chat Threads Layout Placeholder */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-emerald-400 text-sm">
                👤
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-slate-800">CollegenZ Global Feed Channel</p>
                <p className="text-slate-400 text-[11px] truncate max-w-[200px]">Socket.io runtime server testing environment...</p>
              </div>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Live</span>
          </div>
        </div>

        <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/30 text-center text-[11px] text-indigo-600/80">
          ⚙️ WebSocket connection pools initialized under state protocols.
        </div>

      </div>
    </div>
  );
}

