import { redirect } from 'next/navigation';

export default function RootPage() {
  // 🟢 Automatically forces users right into your active timeline page context
  redirect('/feed');
}

