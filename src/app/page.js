'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import HomeExperience from '@/components/HomeExperience';
import Services from '@/components/Services';
import HomeGallery from '@/components/HomeGallery';
// import Testimonials from '@/components/Testimonials';
import WhatsAppTestimonials from '@/components/WhatsAppTestimonials';
import RegionalServiceAreas from '@/components/RegionalServiceAreas';
import FAQSection from '@/components/FAQSection';

export default function Home() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkAdminStatus = () => {
      if (typeof window !== 'undefined') {
        const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
        setAdminLoggedIn(isAdmin);
      }
    };

    checkAdminStatus();
    window.addEventListener('storage', checkAdminStatus);

    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);

  const handleAdminLogout = () => {
    localStorage.setItem('adminLoggedIn', 'false');
    setAdminLoggedIn(false);
    window.dispatchEvent(new Event('storage'));
  };

  const pageContent = (
    <>
      <Hero />
      {/* <HomeExperience /> */}
      <Services />
      <HomeGallery />
      <RegionalServiceAreas />
      <FAQSection />
      {/* <Testimonials /> */}
      <WhatsAppTestimonials />
    </>
  );

  if (!mounted) {
    return <main>{pageContent}</main>;
  }

  return (
    <main>
      {pageContent}

      {adminLoggedIn && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          <a
            href="/admin"
            style={{
              display: 'inline-block',
              padding: '12px 20px',
              backgroundColor: '#ffd700',
              color: '#333',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
            }}
          >
            <i className="fas fa-cog" style={{ marginRight: '8px' }}></i>
            Admin Panel
          </a>

          <button
            onClick={handleAdminLogout}
            style={{
              display: 'block',
              marginTop: '10px',
              padding: '8px 15px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <i className="fas fa-sign-out-alt" style={{ marginRight: '5px' }}></i>
            Logout
          </button>
        </div>
      )}
    </main>
  );
}
