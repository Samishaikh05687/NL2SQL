'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      // Call API route for registration (create below)
      await fetch('/api/register', { method: 'POST', body: JSON.stringify({ email, password }) });
    }
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.ok) router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl mb-4">{isRegister ? 'Register' : 'Sign In'}</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="mb-4 p-2 border w-full" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="mb-4 p-2 border w-full" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2">{isRegister ? 'Register' : 'Sign In'}</button>
        <button type="button" onClick={() => setIsRegister(!isRegister)} className="mt-2 text-blue-600">{isRegister ? 'Switch to Sign In' : 'Switch to Register'}</button>
      </form>
    </div>
  );
}