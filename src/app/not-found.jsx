'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <h1 style={{ fontSize: '3rem' }}>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Link
        href="/"
        style={{
          marginTop: '20px',
          display: 'inline-block',
          color: '#0070f3',
          textDecoration: 'underline',
        }}
      >
        Go back 
      </Link>
    </div>
  );
}
