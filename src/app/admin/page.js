'use client';

import { useState, useEffect } from 'react';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user was previously logged in
    if (typeof window !== 'undefined') {
      const savedLogin = localStorage.getItem('adminRememberMe');
      if (savedLogin === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setIsAuthenticated(true);
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
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminLoggedIn', 'false');
      localStorage.removeItem('adminRememberMe');
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Don't render during SSR to avoid hydration issues
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
          width: '90%',
          maxWidth: '400px',
          color: 'white'
        }}>
          Loading Admin Panel...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <form onSubmit={handleLogin} style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          width: '90%',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>ATMIYA CATERERS Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px',
              marginBottom: '1rem'
            }}
          />
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
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
          <button type="submit" style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ffd700, #ffed4a)',
            color: '#333',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            width: '100%'
          }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <AdminDashboard />
      <button 
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px 15px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 1001
        }}
      >
        <i className="fas fa-sign-out-alt" style={{ marginRight: '5px' }}></i>
        Logout
      </button>
    </div>
  );
}


