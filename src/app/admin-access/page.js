'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAccessPage() {
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if user was previously logged in
    if (typeof window !== 'undefined') {
      const savedLogin = localStorage.getItem('adminRememberMe');
      if (savedLogin === 'true') {
        router.push('/admin');
      }
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      // Set flag in localStorage to indicate admin is logged in
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminLoggedIn', 'true');
        if (rememberMe) {
          localStorage.setItem('adminRememberMe', 'true');
        } else {
          localStorage.removeItem('adminRememberMe');
        }
        // Trigger storage event to update other components
        window.dispatchEvent(new Event('storage'));
      }
      router.push('/admin');
    } else {
      alert('Incorrect password');
    }
  };

  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          color: 'white'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            fontWeight: 'bold'
          }}>
            🔐 Admin Access
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '1.1rem' 
          }}>
            Enter your admin password to continue
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white', 
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ 
                  marginRight: '8px',
                  transform: 'scale(1.2)'
                }}
              />
              Remember me for 30 days
            </label>
          </div>

          <button 
            type="submit" 
            style={{
              padding: '15px 30px',
              border: 'none',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ffd700, #ffed4a)',
              color: '#333',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
            }}
          >
            🚀 Access Admin Panel
          </button>
        </form>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '12px',
            margin: '0'
          }}>
            💡 <strong>Quick Access:</strong> Use <kbd style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontSize: '11px'
            }}>Ctrl + Shift + A</kbd> from anywhere on the site
          </p>
        </div>
      </div>
    </div>
  );
}
