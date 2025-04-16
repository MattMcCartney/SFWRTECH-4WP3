// app/page.js
// Just redirecting to collection
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/collection');
}