'use client';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center font-sans">
      <div className="text-center space-y-2 max-w-xs bg-white border p-6 rounded-2xl shadow-sm">
        <span className="text-2xl">⚙️</span>
        <h1 className="text-sm font-bold text-slate-800">Settings Panel</h1>
        <p className="text-xs text-slate-400">Manage transactional notification tokens and interface parameters.</p>
      </div>
    </div>
  );
}
