'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">NL to SQL Converter</h1>
        <Link href="/auth/signin">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Get Started</button>
        </Link>
      </div>
    </div>
  );
}