'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { defaultPlannerConfig, normalisePlannerConfig } from '@/data/plannerOptions';
import BookingsManagement from './BookingsManagement';
import CatalogueManagement from './catalogue/CatalogueManagement';
const ensureArray = value => (Array.isArray(value) ? value : [])

const slugify = (input, fallback) => {
  const base = (input || '').toString().trim().toLowerCase()
  const slug = base.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  if (slug) {
    return slug
  }
  const fb = (fallback || '').toString().trim().toLowerCase()
  const fallbackSlug = fb.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return fallbackSlug || `item-${Math.random().toString(36).slice(2, 8)}`
}

const defaultCourseKeys = ['starters', 'mains', 'breads', 'sweets', 'beverages']

const convertCoursesToFields = courses => {
  const result = {}
  defaultCourseKeys.forEach(key => {
    const values = ensureArray(courses?.[key])
      result[key] = values.length ? values.join(String.fromCharCode(10)) : ''
  })
  Object.entries(courses || {}).forEach(([key, items]) => {
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      const values = ensureArray(items)
      result[key] = values.length ? values.join(String.fromCharCode(10)) : ''
    }
  })
  if (!Object.keys(result).length) {
    defaultCourseKeys.forEach(key => {
      result[key] = ''
    })
  }
  return result
}

const convertFieldsToCourses = courses =>
  Object.entries(courses || {}).reduce((acc, [key, value]) => {
    const items = (value || '')
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean)
    if (items.length) {
      acc[key] = items
    }
    return acc
  }, {})

const toNumber = value => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const toOptionalNumber = value => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}


export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [testResult, setTestResult] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [services, setServices] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [events, setEvents] = useState([]);
  const [tiffinPlans, setTiffinPlans] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [catalogueCategories, setCatalogueCategories] = useState([]);
  const [catalogueItems, setCatalogueItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/admin/test', { cache: 'no-store' });
      const text = await response.text();
      const checkedAt = new Date().toISOString();

      if (!text) {
        setTestResult({
          success: false,
          error: 'Empty response from server',
          status: response.status,
          checkedAt,
        });
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error for test API:', parseError);
        console.error('Response text:', text);
        setTestResult({
          success: false,
          error: 'Invalid JSON response from server',
          details: text,
          status: response.status,
          checkedAt,
        });
        return;
      }

      if (!response.ok || !data?.success) {
        setTestResult({
          success: false,
          error: data?.error || 'Database test failed',
          details: data?.details || data?.message || null,
          status: response.status,
          checkedAt,
        });
        return;
      }

      setTestResult({
        ...data,
        status: response.status,
        checkedAt,
      });
    } catch (error) {
      console.error('Database connection test error:', error);
      setTestResult({
        success: false,
        error: 'Failed to test connection',
        details: error.message,
        status: 'network-error',
        checkedAt: new Date().toISOString(),
      });
    }
  };

  const fetchData = async (endpoint, setter) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        console.warn(`Empty response from ${endpoint}`);
        setter([]);
        return;
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(`JSON parse error for ${endpoint}:`, parseError);
        console.error('Response text:', text);
        setter([]);
        return;
      }
      
      setter(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      setter([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogueData = useCallback(async () => {
    try {
      setLoading(true);
      const [categoriesResponse, itemsResponse] = await Promise.all([
        fetch('/api/admin/catalogue/categories'),
        fetch('/api/admin/catalogue/items')
      ]);

      const categoriesText = await categoriesResponse.text();
      const itemsText = await itemsResponse.text();

      let categoriesData = [];
      let itemsData = [];

      if (categoriesResponse.ok && categoriesText) {
        try {
          const parsed = JSON.parse(categoriesText);
          categoriesData = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          console.error('JSON parse error for catalogue categories:', error);
        }
      }

      if (itemsResponse.ok && itemsText) {
        try {
          const parsed = JSON.parse(itemsText);
          itemsData = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          console.error('JSON parse error for catalogue items:', error);
        }
      }

      if (!categoriesResponse.ok) {
        console.error('Failed to fetch catalogue categories', categoriesResponse.status);
      }

      if (!itemsResponse.ok) {
        console.error('Failed to fetch catalogue items', itemsResponse.status);
      }

      setCatalogueCategories(categoriesData);
      setCatalogueItems(itemsData);
    } catch (error) {
      console.error('Error fetching catalogue data:', error);
      setCatalogueCategories([]);
      setCatalogueItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const showMessage = (msg, type = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const connectionStatusLabel = testResult === null
    ? '⏳ Testing...'
    : testResult?.success
      ? '✅ Connected'
      : '❌ Disconnected';
  const lastCheckedLabel = testResult?.checkedAt
    ? new Date(testResult.checkedAt).toLocaleString()
    : null;

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  useEffect(() => {
    if (activeSection === 'menu') fetchData('menu', setMenuItems);
    if (activeSection === 'services') fetchData('services', setServices);
    if (activeSection === 'gallery') fetchData('gallery', setGalleryItems);
    if (activeSection === 'testimonials') fetchData('testimonials', setTestimonials);
    if (activeSection === 'events') fetchData('events', setEvents);
    if (activeSection === 'catalogue') fetchCatalogueData();
    if (activeSection === 'tiffin') fetchData('tiffin', setTiffinPlans);
    if (activeSection === 'bookings') {
      fetch('/api/bookings')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.text();
        })
        .then(text => {
          if (!text) {
            console.warn('Empty response from bookings API');
            setBookings([]);
            return;
          }
          
          try {
            const data = JSON.parse(text);
            setBookings(Array.isArray(data) ? data : []);
          } catch (parseError) {
            console.error('JSON parse error for bookings:', parseError);
            console.error('Response text:', text);
            setBookings([]);
          }
        })
        .catch(err => {
          console.error('Error fetching bookings:', err);
          setBookings([]);
        });
    }
  }, [activeSection, fetchCatalogueData]);

  useEffect(() => {
    fetchCatalogueData();
  }, [fetchCatalogueData]);

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="logo">
          <h2>ATMIYA CATERERS</h2>
          <p>Admin Dashboard</p>
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <a className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`} 
               onClick={() => setActiveSection('dashboard')}>
              <i className="fas fa-tachometer-alt"></i>
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeSection === 'menu' ? 'active' : ''}`} 
               onClick={() => setActiveSection('menu')}>
              <i className="fas fa-utensils"></i>
              Menu Items
            </a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeSection === 'services' ? 'active' : ''}`} 
               onClick={() => setActiveSection('services')}>
              <i className="fas fa-concierge-bell"></i>
              Services
            </a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeSection === 'gallery' ? 'active' : ''}`} 
               onClick={() => setActiveSection('gallery')}>
              <i className="fas fa-images"></i>
              Gallery
            </a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeSection === 'testimonials' ? 'active' : ''}`} 
               onClick={() => setActiveSection('testimonials')}>
              <i className="fas fa-quote-left"></i>
              Testimonials
            </a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeSection === 'events' ? 'active' : ''}`} 
               onClick={() => setActiveSection('events')}>
              <i className="fas fa-calendar-alt"></i>
              Events
            </a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeSection === 'tiffin' ? 'active' : ''}`} 
               onClick={() => setActiveSection('tiffin')}>
              <i className="fas fa-box"></i>
              Tiffin Plans
            </a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeSection === 'bookings' ? 'active' : ''}`} 
               onClick={() => setActiveSection('bookings')}>
              <i className="fas fa-calendar-check"></i>
              Bookings
            </a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeSection === 'planner' ? 'active' : ''}`} 
               onClick={() => setActiveSection('planner')}>
              <i className="fas fa-clipboard-list"></i>
              Planner Studio
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link"
               href="/planner"
               target="_blank"
               rel="noopener noreferrer">
              <i className="fas fa-calendar-plus"></i>
              Plan Your Event
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/admin/checkin" target="_blank">
              <i className="fas fa-qrcode"></i>
              Check-In System
            </a>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1>Welcome to Admin Dashboard!</h1>
          <p>Database Connection: {connectionStatusLabel}</p>
          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>

        {activeSection === 'dashboard' && (
          <section id="dashboard" className="content-section active">
            <h2 className="section-title">
              <i className="fas fa-chart-line"></i>
              Dashboard Overview
            </h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Menu Items</h3>
                <p className="stat-number">{menuItems.length}</p>
              </div>
              <div className="stat-card">
                <h3>Services</h3>
                <p className="stat-number">{services.length}</p>
              </div>
              <div className="stat-card">
                <h3>Gallery Items</h3>
                <p className="stat-number">{galleryItems.length}</p>
              </div>
              <div className="stat-card">
                <h3>Testimonials</h3>
                <p className="stat-number">{testimonials.length}</p>
              </div>
              <div className="stat-card">
                <h3>Bookings</h3>
                <p className="stat-number">{bookings.length}</p>
              </div>
              <div className="stat-card">
                <h3>Checked In</h3>
                <p className="stat-number">{(bookings || []).filter(b => b.status === 'checked-in').length}</p>
              </div>
            </div>
            
            <div className="card">
              <h3>Database Connection Test</h3>
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
              {testResult?.status && (
                <p style={{ color: '#4b5563', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Response status: {testResult.status}
                </p>
              )}
              {testResult?.error && (
                <p style={{ color: '#b91c1c', marginTop: '0.5rem' }}>
                  {testResult.error}
                  {testResult?.details ? ` — ${testResult.details}` : ''}
                </p>
              )}
              {lastCheckedLabel && (
                <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Last checked: {lastCheckedLabel}
                </p>
              )}
              <button onClick={testDatabaseConnection} className="btn btn-primary">
                Test Connection Again
              </button>
            </div>
          </section>
        )}

        {activeSection === 'menu' && (
          <section id="menu" className="content-section active">
            <h2 className="section-title">
              <i className="fas fa-utensils"></i>
              Menu Items Management
            </h2>
            <MenuManagement 
              items={menuItems} 
              setItems={setMenuItems}
              showMessage={showMessage}
              loading={loading}
            />
          </section>
        )}

        {activeSection === 'catalogue' && (
          <section id="catalogue" className="content-section active">
            <h2 className="section-title">
              <i className="fas fa-book-open"></i>
              Food Catalogue Management
            </h2>
            <CatalogueManagement
              categories={catalogueCategories}
              setCategories={setCatalogueCategories}
              items={catalogueItems}
              setItems={setCatalogueItems}
              refreshCatalogue={fetchCatalogueData}
              showMessage={showMessage}
              loading={loading}
            />
          </section>
        )}

        {activeSection === 'services' && (
          <section id="services" className="content-section active">
            <h2 className="section-title">
              <i className="fas fa-concierge-bell"></i>
              Services Management
            </h2>
            <ServicesManagement 
              items={services} 
              setItems={setServices}
              showMessage={showMessage}
              loading={loading}
            />
          </section>
        )}

        {activeSection === 'gallery' && (
          <section id="gallery" className="content-section active">
            <h2 className="section-title">
              <i className="fas fa-images"></i>
              Gallery Management
            </h2>
            <GalleryManagement 
              items={galleryItems} 
              setItems={setGalleryItems}
              showMessage={showMessage}
              loading={loading}
            />
          </section>
        )}

        {activeSection === 'testimonials' && (
          <section id="testimonials" className="content-section active">
            <h2 className="section-title">
              <i className="fas fa-quote-left"></i>
              Testimonials Management
            </h2>
            <TestimonialsManagement 
              items={testimonials} 
              setItems={setTestimonials}
              showMessage={showMessage}
              loading={loading}
            />
          </section>
        )}

        {activeSection === 'events' && (
          <section id="events" className="content-section active">
            <h2 className="section-title">
              <i className="fas fa-calendar-alt"></i>
              Events Management
            </h2>
            <EventsManagement 
              items={events} 
              setItems={setEvents}
              showMessage={showMessage}
              loading={loading}
            />
          </section>
        )}

        {activeSection === 'planner' && (
          <section id="planner" className="content-section active">
            <h2 className="section-title">
              <i className="fas fa-clipboard-list"></i>
              Planner Studio
            </h2>
            <PlannerManagement showMessage={showMessage} />
          </section>
        )}

        {activeSection === 'tiffin' && (
          <section id="tiffin" className="content-section active">

            <h2 className="section-title">
              <i className="fas fa-box"></i>
              Tiffin Plans Management
            </h2>
            <TiffinManagement 
              items={tiffinPlans} 
              setItems={setTiffinPlans}
              showMessage={showMessage}
              loading={loading}
            />
          </section>
        )}

        {activeSection === 'bookings' && (
          <section id="bookings" className="content-section active">
            <h2 className="section-title">
              <i className="fas fa-calendar-check"></i>
              Bookings Management
            </h2>
            <BookingsManagement 
              items={bookings} 
              setItems={setBookings}
              showMessage={showMessage}
              loading={loading}
            />
          </section>
        )}
      </main>

      <style jsx>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .sidebar {
          width: 280px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          padding: 20px 0;
        }
        
        .logo {
          text-align: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 20px;
        }
        
        .logo h2 {
          color: white;
          font-size: 24px;
          margin-bottom: 5px;
        }
        
        .logo p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }
        
        .nav-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .nav-item {
          margin: 5px 20px;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .nav-link:hover, .nav-link.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateX(5px);
        }
        
        .main-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
        
        .header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .header h1 {
          color: white;
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        .header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
        }
        
        .content-section {
          display: none;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 30px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .content-section.active {
          display: block;
        }
        
        .section-title {
          color: white;
          font-size: 28px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }

        .card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          margin-bottom: 20px;
        }
        
        .card h3 {
          color: white;
          margin-bottom: 15px;
        }
        
        pre {
          background: rgba(0, 0, 0, 0.2);
          padding: 15px;
          border-radius: 8px;
          color: white;
          overflow-x: auto;
          margin-bottom: 15px;
        }
        
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #ffd700, #ffed4a);
          color: #333;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
        }

        .message {
          padding: 10px 15px;
          border-radius: 8px;
          margin-top: 10px;
          font-weight: 500;
        }

        .message.success {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .message.error {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 20px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
        }

        .stat-card h3 {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-number {
          color: white;
          font-size: 32px;
          font-weight: bold;
          margin: 0;
        }

        .management-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: white;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 16px;
          backdrop-filter: blur(5px);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .btn-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3);
        }

        .items-list {
          margin-top: 20px;
        }

        .item-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
        }

        .item-card h4 {
          color: white;
          margin-bottom: 10px;
        }

        .item-card p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 10px;
        }

        .item-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .loading {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          padding: 20px;
        }


        .planner-wrapper {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .planner-shell {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .planner-headline-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 26px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .planner-headline {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
        }
        .planner-headline__copy {
          max-width: 540px;
          color: #fff;
        }
        .planner-headline__eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.65);
          margin: 0 0 6px 0;
        }
        .planner-headline__title {
          margin: 0;
          font-size: 28px;
        }
        .planner-headline__subtitle {
          margin: 8px 0 0 0;
          color: rgba(255, 255, 255, 0.75);
          font-size: 14px;
          line-height: 1.6;
        }
        .planner-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }
        .planner-stat {
          background: rgba(12, 18, 33, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .planner-stat__value {
          font-size: 24px;
          font-weight: 600;
          color: #fff;
        }
        .planner-stat__label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .planner-stat__hint {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
        }
        .planner-toggle {
          align-self: stretch;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 18px;
          padding: 18px 20px;
        }
        .planner-admin-layout {
          display: grid;
          grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
          gap: 28px;
          align-items: flex-start;
        }
        .planner-nav {
          position: sticky;
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: rgba(12, 18, 33, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 20px;
          max-height: calc(100vh - 120px);
          overflow: hidden;
        }
        .planner-nav__title {
          margin: 0;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.6);
        }
        .planner-nav__list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          padding-right: 2px;
        }
        .planner-nav__item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          border-radius: 16px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.82);
          padding: 12px 14px;
          text-align: left;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .planner-nav__item:hover {
          transform: translateX(2px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
        }
        .planner-nav__item.active {
          border-color: rgba(255, 212, 130, 0.9);
          background: linear-gradient(135deg, rgba(255, 212, 130, 0.22), rgba(255, 255, 255, 0.08));
          color: #fff;
        }
        .planner-nav__index {
          width: 28px;
          height: 28px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }
        .planner-nav__label {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .planner-nav__label-title {
          font-size: 14px;
          font-weight: 600;
        }
        .planner-nav__label-sub {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
        .planner-nav__count {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.75);
        }
        .planner-nav__actions {
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .planner-nav__actions-title {
          margin: 0;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }
        .planner-quick-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .planner-quick-button {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          padding: 10px 12px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
          text-align: left;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .planner-quick-button:hover {
          background: rgba(255, 255, 255, 0.16);
          transform: translateX(2px);
        }
        .planner-content {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .planner-section {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 24px;
        }
        .planner-section__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }
        .planner-section__title {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .planner-count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.16);
          color: #fff;
        }
        .planner-section__header h3 {
          color: #fff;
          margin: 0;
          font-size: 20px;
        }
        .planner-section__description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 18px;
        }
        .planner-card {
          background: rgba(12, 18, 33, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .planner-card:last-of-type {
          margin-bottom: 0;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .card-header h4 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }
        .card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-small {
          padding: 6px 12px;
          font-size: 13px;
        }
        .btn-link {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: 12px;
          padding: 0;
        }
        .btn-link:hover {
          color: #fff;
        }
        .field-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 14px;
        }
        .field input,
        .field select,
        .field textarea {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: #fff;
          padding: 10px 12px;
          font-size: 14px;
        }
        .field textarea {
          min-height: 80px;
        }
        .course-group-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .course-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
          margin-bottom: 4px;
        }
        .empty-note {
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }
        .help-text {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          margin-top: 6px;
        }
        .planner-actions {
          position: sticky;
          bottom: 24px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 16px;
          background: rgba(5, 10, 22, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 18px 24px;
          box-shadow: 0 18px 40px rgba(5, 10, 22, 0.45);
          backdrop-filter: blur(8px);
        }
        .message.info {
          background: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
        }
        @media (max-width: 1200px) {
          .planner-admin-layout {
            grid-template-columns: minmax(0, 1fr);
          }
          .planner-nav {
            position: static;
            max-height: none;
          }
        }
        @media (max-width: 900px) {
          .planner-summary-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }
          .planner-nav {
            flex-direction: column;
            gap: 12px;
          }
        }
        @media (max-width: 768px) {
          .planner-headline__title {
            font-size: 24px;
          }
          .planner-nav__list {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 4px;
          }
          .planner-nav__item {
            min-width: 220px;
          }
          .planner-actions {
            position: static;
            justify-content: stretch;
          }
        }
        @media (max-width: 768px) {
          .admin-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
          }
          
          .nav-menu {
            display: flex;
            overflow-x: auto;
            padding: 0 20px;
          }
          
          .nav-item {
            margin: 5px 10px;
            flex-shrink: 0;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

// Management Components
function MenuManagement({ items, setItems, showMessage, loading }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/admin/menu/${editingItem._id}` : '/api/admin/menu';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showMessage(result.message);
        setShowForm(false);
        setEditingItem(null);
        setFormData({ name: '', description: '', price: '', category: '', image: '', isAvailable: true });
        // Refresh data
        const updatedResponse = await fetch('/api/admin/menu');
        const updatedData = await updatedResponse.json();
        setItems(updatedData);
      }
    } catch (error) {
      showMessage('Error saving menu item', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category || '',
      image: item.image || '',
      isAvailable: item.isAvailable !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        const response = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
          showMessage(result.message);
          setItems(items.filter(item => item._id !== id));
        }
      } catch (error) {
        showMessage('Error deleting menu item', 'error');
      }
    }
  };

  if (loading) return <div className="loading">Loading menu items...</div>;

  return (
    <div className="management-section">
      <div className="btn-group">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Menu Item'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Menu item name"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Menu item description"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="Price (e.g., CA$150)"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="appetizers">Appetizers</option>
              <option value="main-course">Main Course</option>
              <option value="desserts">Desserts</option>
              <option value="beverages">Beverages</option>
              <option value="tiffin">Tiffin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="Image URL"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                style={{ marginRight: '10px' }}
              />
              Available
            </label>
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Update' : 'Add'} Menu Item
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
                setFormData({ name: '', description: '', price: '', category: '', image: '', isAvailable: true });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="items-list">
        {(items || []).map((item) => (
          <div key={item._id} className="item-card">
            <h4>{item.name}</h4>
            <p><strong>Price:</strong> {item.price}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Status:</strong> {item.isAvailable ? 'Available' : 'Not Available'}</p>
            <div className="item-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesManagement({ items, setItems, showMessage, loading }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    features: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/admin/services/${editingItem._id}` : '/api/admin/services';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showMessage(result.message);
        setShowForm(false);
        setEditingItem(null);
        setFormData({ title: '', description: '', icon: '', features: [] });
        // Refresh data
        const updatedResponse = await fetch('/api/admin/services');
        const updatedData = await updatedResponse.json();
        setItems(updatedData);
      }
    } catch (error) {
      showMessage('Error saving service', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      icon: item.icon || '',
      features: item.features || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
          showMessage(result.message);
          setItems(items.filter(item => item._id !== id));
        }
      } catch (error) {
        showMessage('Error deleting service', 'error');
      }
    }
  };

  if (loading) return <div className="loading">Loading services...</div>;

  return (
    <div className="management-section">
      <div className="btn-group">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Service title"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Service description"
            />
          </div>
          <div className="form-group">
            <label>Icon (FontAwesome class)</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              placeholder="e.g., fas fa-utensils"
            />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Update' : 'Add'} Service
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
                setFormData({ title: '', description: '', icon: '', features: [] });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="items-list">
        {(items || []).map((item) => (
          <div key={item._id} className="item-card">
            <h4>{item.title}</h4>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Icon:</strong> {item.icon}</p>
            <div className="item-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryManagement({ items, setItems, showMessage, loading }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/admin/gallery/${editingItem._id}` : '/api/admin/gallery';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showMessage(result.message);
        setShowForm(false);
        setEditingItem(null);
        setFormData({ title: '', image: '', category: '', description: '' });
        // Refresh data
        const updatedResponse = await fetch('/api/admin/gallery');
        const updatedData = await updatedResponse.json();
        setItems(updatedData);
      }
    } catch (error) {
      showMessage('Error saving gallery item', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      image: item.image || '',
      category: item.category || '',
      description: item.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      try {
        const response = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
          showMessage(result.message);
          setItems(items.filter(item => item._id !== id));
        }
      } catch (error) {
        showMessage('Error deleting gallery item', 'error');
      }
    }
  };

  if (loading) return <div className="loading">Loading gallery items...</div>;

  return (
    <div className="management-section">
      <div className="btn-group">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Gallery Item'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Gallery item title"
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="Image URL"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="events">Events</option>
              <option value="kitchen">Kitchen</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Gallery item description"
            />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Update' : 'Add'} Gallery Item
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
                setFormData({ title: '', image: '', category: '', description: '' });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="items-list">
        {(items || []).map((item) => (
          <div key={item._id} className="item-card">
            <h4>{item.title}</h4>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Description:</strong> {item.description}</p>
            {item.image && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={item.image} 
                  alt={item.title}
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '150px', 
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
            <div className="item-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsManagement({ items, setItems, showMessage, loading }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    review: '',
    rating: 5,
    location: '',
    image: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/admin/testimonials/${editingItem._id}` : '/api/admin/testimonials';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showMessage(result.message);
        setShowForm(false);
        setEditingItem(null);
        setFormData({ name: '', review: '', rating: 5, location: '', image: '' });
        // Refresh data
        const updatedResponse = await fetch('/api/admin/testimonials');
        const updatedData = await updatedResponse.json();
        setItems(updatedData);
      }
    } catch (error) {
      showMessage('Error saving testimonial', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      review: item.review || '',
      rating: item.rating || 5,
      location: item.location || '',
      image: item.image || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const response = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
          showMessage(result.message);
          setItems(items.filter(item => item._id !== id));
        }
      } catch (error) {
        showMessage('Error deleting testimonial', 'error');
      }
    }
  };

  if (loading) return <div className="loading">Loading testimonials...</div>;

  return (
    <div className="management-section">
      <div className="btn-group">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Testimonial'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Customer name"
              required
            />
          </div>
          <div className="form-group">
            <label>Review</label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData({...formData, review: e.target.value})}
              placeholder="Customer review"
              required
            />
          </div>
          <div className="form-group">
            <label>Rating (1-5)</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Customer location"
            />
          </div>
          <div className="form-group">
            <label>Customer Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="Customer image URL"
            />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Update' : 'Add'} Testimonial
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
                setFormData({ name: '', review: '', rating: 5, location: '', image: '' });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="items-list">
        {(items || []).map((item) => (
          <div key={item._id} className="item-card">
            <h4>{item.name}</h4>
            <p><strong>Rating:</strong> {'★'.repeat(item.rating)} ({item.rating}/5)</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Review:</strong> {item.review}</p>
            <div className="item-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsManagement({ items, setItems, showMessage, loading }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
    price: '',
    capacity: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/admin/events/${editingItem._id}` : '/api/admin/events';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showMessage(result.message);
        setShowForm(false);
        setEditingItem(null);
        setFormData({ title: '', description: '', date: '', location: '', image: '', price: '', capacity: '' });
        // Refresh data
        const updatedResponse = await fetch('/api/admin/events');
        const updatedData = await updatedResponse.json();
        setItems(updatedData);
      }
    } catch (error) {
      showMessage('Error saving event', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      date: item.date || '',
      location: item.location || '',
      image: item.image || '',
      price: item.price || '',
      capacity: item.capacity || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
          showMessage(result.message);
          setItems(items.filter(item => item._id !== id));
        }
      } catch (error) {
        showMessage('Error deleting event', 'error');
      }
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="management-section">
      <div className="btn-group">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Event title"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Event description"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Event location"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="Event price"
            />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              placeholder="Maximum capacity"
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="Event image URL"
            />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Update' : 'Add'} Event
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
                setFormData({ title: '', description: '', date: '', location: '', image: '', price: '', capacity: '' });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="items-list">
        {(items || []).map((item) => (
          <div key={item._id} className="item-card">
            <h4>{item.title}</h4>
            <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Price:</strong> {item.price}</p>
            <p><strong>Capacity:</strong> {item.capacity}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <div className="item-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TiffinManagement({ items, setItems, showMessage, loading }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    meals: [],
    features: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/admin/tiffin/${editingItem._id}` : '/api/admin/tiffin';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showMessage(result.message);
        setShowForm(false);
        setEditingItem(null);
        setFormData({ name: '', description: '', price: '', duration: '', meals: [], features: [] });
        // Refresh data
        const updatedResponse = await fetch('/api/admin/tiffin');
        const updatedData = await updatedResponse.json();
        setItems(updatedData);
      }
    } catch (error) {
      showMessage('Error saving tiffin plan', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      duration: item.duration || '',
      meals: item.meals || [],
      features: item.features || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this tiffin plan?')) {
      try {
        const response = await fetch(`/api/admin/tiffin/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
          showMessage(result.message);
          setItems(items.filter(item => item._id !== id));
        }
      } catch (error) {
        showMessage('Error deleting tiffin plan', 'error');
      }
    }
  };

  if (loading) return <div className="loading">Loading tiffin plans...</div>;

  return (
    <div className="management-section">
      <div className="btn-group">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Tiffin Plan'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Plan Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Tiffin plan name"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Plan description"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="Plan price"
            />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="e.g., 1 month, 3 months"
            />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Update' : 'Add'} Tiffin Plan
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
                setFormData({ name: '', description: '', price: '', duration: '', meals: [], features: [] });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="items-list">
        {(items || []).map((item) => (
          <div key={item._id} className="item-card">
            <h4>{item.name}</h4>
            <p><strong>Price:</strong> {item.price}</p>
            <p><strong>Duration:</strong> {item.duration}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <div className="item-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function PlannerManagement({ showMessage }) {
  const buildChecklistString = checklist => ensureArray(checklist).join('\\n')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [plannerEnabled, setPlannerEnabled] = useState(defaultPlannerConfig.plannerEnabled ?? true)
  const [eventTypes, setEventTypes] = useState([])
  const [serviceLevels, setServiceLevels] = useState([])
  const [menuCollections, setMenuCollections] = useState([])
  const [experienceAddons, setExperienceAddons] = useState([])
  const [catalogueCategories, setCatalogueCategories] = useState([])
  const [menuCategories, setMenuCategories] = useState([])
  const [checklistText, setChecklistText] = useState(buildChecklistString(defaultPlannerConfig.onboardingChecklist))
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const sectionRefs = useRef({})
  const [activeSectionId, setActiveSectionId] = useState('planner-section-celebrations')

  const scrollToSection = useCallback(id => {
    const node = sectionRefs.current?.[id]
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const registerSectionRef = useCallback(id => node => {
    if (!sectionRefs.current) {
      sectionRefs.current = {}
    }
    if (node) {
      sectionRefs.current[id] = node
    } else {
      delete sectionRefs.current[id]
    }
  }, [])


  const hydrateFromConfig = useCallback(config => {
    setEventTypes(
      ensureArray(config.eventTypes).map(item => ({
        id: item.id || '',
        name: item.name || '',
        description: item.description || '',
        pricePerGuest: item.pricePerGuest ?? '',
        highlight: item.highlight || '',
      }))
    )

    setServiceLevels(
      ensureArray(config.serviceLevels).map(item => ({
        id: item.id || '',
        name: item.name || '',
        description: item.description || '',
        pricePerGuest: item.pricePerGuest ?? '',
      }))
    )

    setMenuCollections(
      ensureArray(config.menuCollections).map(collection => ({
        id: collection.id || '',
        name: collection.name || '',
        headline: collection.headline || '',
        pricePerGuest: collection.pricePerGuest ?? '',
        courses: convertCoursesToFields(collection.courses || {}),
      }))
    )

    setExperienceAddons(
      ensureArray(config.experienceAddons).map(item => ({
        id: item.id || '',
        name: item.name || '',
        description: item.description || '',
        type: item.type || 'per_person',
        price: item.price ?? '',
      }))
    )

    setMenuCategories(
      ensureArray(config.menuBuilderCategories).map(category => ({
        id: category.id || '',
        label: category.label || '',
        description: category.description || '',
        maxSelections: category.maxSelections ?? '',
        minSelections: category.minSelections ?? '',
        categoryIds: ensureArray(category.categoryIds)
          .map(entry => (entry && entry.toString ? entry.toString() : entry))
          .filter(Boolean),
        includeChildCategories: category.includeChildCategories !== false,
        tierFilter:
          typeof category.tierFilter === 'string' && category.tierFilter
            ? category.tierFilter.toLowerCase()
            : 'all',
        pricingMode:
          typeof category.pricingMode === 'string' && category.pricingMode
            ? category.pricingMode
            : 'auto',
      }))
    )

    setChecklistText(buildChecklistString(config.onboardingChecklist))
  }, [])

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const response = await fetch('/api/admin/planner', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Failed to load planner settings')
      }
      const data = await response.json()
      const config = normalisePlannerConfig(data?.plannerConfig || data?.config || {})
      setPlannerEnabled(
        typeof data?.plannerEnabled === 'boolean'
          ? data.plannerEnabled
          : config.plannerEnabled ?? defaultPlannerConfig.plannerEnabled ?? true
      )
      hydrateFromConfig(config)
    } catch (err) {
      console.error('Failed to load planner settings', err)
      hydrateFromConfig(normalisePlannerConfig(defaultPlannerConfig))
      setPlannerEnabled(defaultPlannerConfig.plannerEnabled ?? true)
      setError('Failed to load planner settings. Showing defaults until you save.')
    } finally {
      setLoading(false)
    }
  }, [hydrateFromConfig])

  const loadCatalogueCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/catalogue/categories', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`Failed to fetch catalogue categories (${response.status})`)
      }
      const text = await response.text()
      if (!text) {
        setCatalogueCategories([])
        return
      }
      const data = JSON.parse(text)
      setCatalogueCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load catalogue categories for planner', err)
      setCatalogueCategories([])
    }
  }, [])

  useEffect(() => {
    loadSettings()
    loadCatalogueCategories()
  }, [loadSettings, loadCatalogueCategories])

  const addEventType = useCallback(() => {
    setEventTypes(prev => [...prev, { id: '', name: '', description: '', pricePerGuest: '', highlight: '' }])
  }, [])

  const updateEventType = (index, key, value) => {
    setEventTypes(prev => prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)))
  }

  const removeEventType = index => {
    setEventTypes(prev => prev.filter((_, idx) => idx !== index))
  }

  const addServiceLevel = useCallback(() => {
    setServiceLevels(prev => [...prev, { id: '', name: '', description: '', pricePerGuest: '' }])
  }, [])

  const updateServiceLevel = (index, key, value) => {
    setServiceLevels(prev => prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)))
  }

  const removeServiceLevel = index => {
    setServiceLevels(prev => prev.filter((_, idx) => idx !== index))
  }

  const addMenuCollection = useCallback(() => {
    setMenuCollections(prev => [...prev, { id: '', name: '', headline: '', pricePerGuest: '', courses: convertCoursesToFields({}) }])
  }, [])

  const updateCollectionField = (index, key, value) => {
    setMenuCollections(prev => prev.map((collection, idx) => (idx === index ? { ...collection, [key]: value } : collection)))
  }

  const updateCollectionCourse = (collectionIndex, courseKey, value) => {
    setMenuCollections(prev =>
      prev.map((collection, idx) => {
        if (idx !== collectionIndex) return collection
        return {
          ...collection,
          courses: {
            ...collection.courses,
            [courseKey]: value,
          },
        }
      })
    )
  }

  const addCourseGroup = collectionIndex => {
    const key = prompt('Enter a course key (e.g., starters, mains)')
    if (!key) return
    setMenuCollections(prev =>
      prev.map((collection, idx) => {
        if (idx !== collectionIndex) return collection
        if (collection.courses[key]) return collection
        return {
          ...collection,
          courses: {
            ...collection.courses,
            [key]: '',
          },
        }
      })
    )
  }

  const removeCourseGroup = (collectionIndex, courseKey) => {
    setMenuCollections(prev =>
      prev.map((collection, idx) => {
        if (idx !== collectionIndex) return collection
        const updatedCourses = { ...collection.courses }
        delete updatedCourses[courseKey]
        return {
          ...collection,
          courses: Object.keys(updatedCourses).length ? updatedCourses : convertCoursesToFields({}),
        }
      })
    )
  }

  const removeMenuCollection = index => {
    setMenuCollections(prev => prev.filter((_, idx) => idx !== index))
  }

  const addExperienceAddon = useCallback(() => {
    setExperienceAddons(prev => [...prev, { id: '', name: '', description: '', type: 'per_person', price: '' }])
  }, [])

  const updateExperienceAddon = (index, key, value) => {
    setExperienceAddons(prev => prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)))
  }

  const removeExperienceAddon = index => {
    setExperienceAddons(prev => prev.filter((_, idx) => idx !== index))
  }

  const addMenuCategory = useCallback(() => {
    setMenuCategories(prev => [
      ...prev,
      {
        id: '',
        label: '',
        description: '',
        maxSelections: '',
        minSelections: '',
        categoryIds: [],
        includeChildCategories: true,
        tierFilter: 'all',
        pricingMode: 'auto',
      },
    ])
  }, [])

  const updateMenuCategory = (index, key, value) => {
    setMenuCategories(prev => prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)))
  }

  const removeMenuCategory = index => {
    setMenuCategories(prev => prev.filter((_, idx) => idx !== index))
  }

  const handleReset = () => {
    hydrateFromConfig(normalisePlannerConfig(defaultPlannerConfig))
    setPlannerEnabled(defaultPlannerConfig.plannerEnabled ?? true)
    setError('')
    setSuccess('Defaults restored (remember to save).')
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const payloadConfig = {
      eventTypes: eventTypes
        .map((item, index) => ({
          id: (item.id || slugify(item.name, `event-${index + 1}`)).trim(),
          name: item.name.trim(),
          description: item.description.trim(),
          pricePerGuest: toNumber(item.pricePerGuest),
          highlight: item.highlight.trim(),
        }))
        .filter(item => item.name),
      serviceLevels: serviceLevels
        .map((item, index) => ({
          id: (item.id || slugify(item.name, `service-${index + 1}`)).trim(),
          name: item.name.trim(),
          description: item.description.trim(),
          pricePerGuest: toNumber(item.pricePerGuest),
        }))
        .filter(item => item.name),
      menuCollections: menuCollections
        .map((collection, index) => ({
          id: (collection.id || slugify(collection.name, `collection-${index + 1}`)).trim(),
          name: collection.name.trim(),
          headline: collection.headline.trim(),
          pricePerGuest: toNumber(collection.pricePerGuest),
          courses: convertFieldsToCourses(collection.courses),
        }))
        .filter(collection => collection.name),
      experienceAddons: experienceAddons
        .map((addon, index) => ({
          id: (addon.id || slugify(addon.name, `addon-${index + 1}`)).trim(),
          name: addon.name.trim(),
          description: addon.description.trim(),
          type: addon.type === 'flat' ? 'flat' : 'per_person',
          price: toNumber(addon.price),
        }))
        .filter(addon => addon.name),
      menuBuilderCategories: menuCategories
        .map((category, index) => {
          const categoryIds = ensureArray(category.categoryIds)
            .map(entry => (entry && entry.toString ? entry.toString() : entry))
            .map(entry => (entry ? entry.trim() : entry))
            .filter(Boolean)

          if (!categoryIds.length) {
            return null
          }

          const tierKey = (category.tierFilter || 'all').toString().toLowerCase()
          const tierFilter = ['all', 'standard', 'premium', 'signature'].includes(tierKey) ? tierKey : 'all'

          const payload = {
            id: (category.id || slugify(category.label, `category-${index + 1}`)).trim(),
            label: category.label.trim() || `Category ${index + 1}`,
            description: category.description.trim(),
            categoryIds,
            includeChildCategories: category.includeChildCategories !== false,
            tierFilter,
            pricingMode: category.pricingMode || 'auto',
          }

          const maxSelections = toOptionalNumber(category.maxSelections)
          const minSelections = toOptionalNumber(category.minSelections)

          if (maxSelections !== undefined) {
            payload.maxSelections = maxSelections
          }
          if (minSelections !== undefined) {
            payload.minSelections = minSelections
          }

          return payload
        })
        .filter(Boolean),
      onboardingChecklist: checklistText
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean),
    }

    try {
      setSaving(true)
      const response = await fetch('/api/admin/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plannerEnabled, plannerConfig: payloadConfig }),
      })
      const data = await response.json()
      if (!response.ok || data?.success === false) {
        throw new Error(data?.error || 'Unable to save planner settings')
      }
      await loadSettings()
      const successMessage = 'Planner settings saved and synced to the live planner.'
      setSuccess(successMessage)
      showMessage && showMessage(successMessage)
    } catch (err) {
      console.error('Failed to save planner settings', err)
      const message = err.message || 'Failed to save planner settings.'
      setError(message)
      showMessage && showMessage(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const onboardingItemsCount = useMemo(() => {
    return checklistText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean).length
  }, [checklistText])

  const plannerSummaryCards = useMemo(
    () => [
      { label: 'Event styles', value: eventTypes.length, helper: 'Client entry points' },
      { label: 'Service tiers', value: serviceLevels.length, helper: 'Staffing experiences' },
      { label: 'Menu collections', value: menuCollections.length, helper: 'Curated menu stories' },
      { label: 'Experience add-ons', value: experienceAddons.length, helper: 'Upsell opportunities' },
      { label: 'Menu categories', value: menuCategories.length, helper: 'Dish pickers' },
    ],
    [eventTypes.length, serviceLevels.length, menuCollections.length, experienceAddons.length, menuCategories.length]
  )

  const plannerSectionsMeta = useMemo(
    () => [
      {
        id: 'planner-section-celebrations',
        label: 'Celebration styles',
        subtitle: 'Event presets and pricing',
        count: eventTypes.length,
      },
      {
        id: 'planner-section-service-levels',
        label: 'Service levels',
        subtitle: 'Hospitality tiers',
        count: serviceLevels.length,
      },
      {
        id: 'planner-section-menu-collections',
        label: 'Menu collections',
        subtitle: 'Signature menus',
        count: menuCollections.length,
      },
      {
        id: 'planner-section-addons',
        label: 'Experience add-ons',
        subtitle: 'Upgrades & counters',
        count: experienceAddons.length,
      },
      {
        id: 'planner-section-menu-builder',
        label: 'Menu builder',
        subtitle: 'Dish-level options',
        count: menuCategories.length,
      },
      {
        id: 'planner-section-onboarding',
        label: 'Onboarding checklist',
        subtitle: 'After-enquiry steps',
        count: onboardingItemsCount,
      },
    ],
    [
      eventTypes.length,
      serviceLevels.length,
      menuCollections.length,
      experienceAddons.length,
      menuCategories.length,
      onboardingItemsCount,
    ]
  )

  const plannerQuickActions = useMemo(
    () => [
      {
        label: 'Add event style',
        onClick: () => {
          addEventType()
          setTimeout(() => scrollToSection('planner-section-celebrations'), 120)
        },
      },
      {
        label: 'Add service level',
        onClick: () => {
          addServiceLevel()
          setTimeout(() => scrollToSection('planner-section-service-levels'), 120)
        },
      },
      {
        label: 'Add menu collection',
        onClick: () => {
          addMenuCollection()
          setTimeout(() => scrollToSection('planner-section-menu-collections'), 120)
        },
      },
      {
        label: 'Add experience add-on',
        onClick: () => {
          addExperienceAddon()
          setTimeout(() => scrollToSection('planner-section-addons'), 120)
        },
      },
      {
        label: 'Add menu category',
        onClick: () => {
          addMenuCategory()
          setTimeout(() => scrollToSection('planner-section-menu-builder'), 120)
        },
      },
    ],
    [addEventType, addServiceLevel, addMenuCollection, addExperienceAddon, addMenuCategory, scrollToSection]
  )

  const catalogueCategoryOptions = useMemo(() => {
    const map = new Map()
    ensureArray(catalogueCategories).forEach(category => {
      const id = category?._id?.toString?.() ?? category?._id
      if (id) {
        map.set(id, category)
      }
    })

    const options = ensureArray(catalogueCategories).map(category => {
      const id = category?._id?.toString?.() ?? category?._id
      const parentId = category?.parentId?.toString?.() ?? category?.parentId
      const parent = parentId ? map.get(parentId) : null
      const label = parent
        ? `${parent.name || parent.slug || parentId} → ${category.name || category.slug || id}`
        : category.name || category.slug || id
      return { id, label }
    })

    return options.sort((a, b) => (a.label || '').localeCompare(b.label || ''))
  }, [catalogueCategories])

  useEffect(() => {
    if (!plannerSectionsMeta.length) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => Number(a.target.dataset.navIndex || 0) - Number(b.target.dataset.navIndex || 0))

        const nextId = visible[0]?.target?.id
        if (nextId) {
          setActiveSectionId(prev => (prev === nextId ? prev : nextId))
        }
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0.2, 0.4, 0.6] }
    )

    const nodes = plannerSectionsMeta
      .map((section, index) => {
        const node = sectionRefs.current?.[section.id]
        if (node) {
          node.dataset.navIndex = String(index)
          observer.observe(node)
        }
        return node
      })
      .filter(Boolean)

    return () => {
      nodes.forEach(node => observer.unobserve(node))
      observer.disconnect()
    }
  }, [plannerSectionsMeta])

  useEffect(() => {
    if (!plannerSectionsMeta.length) {
      return
    }
    const hasActive = plannerSectionsMeta.some(section => section.id === activeSectionId)
    if (!hasActive) {
      setActiveSectionId(plannerSectionsMeta[0].id)
    }
  }, [plannerSectionsMeta, activeSectionId])

  return (
    <div className="planner-wrapper">
      <form onSubmit={handleSubmit} className="planner-shell">
        <div className="planner-headline-card">
          <div className="planner-headline">
            <div className="planner-headline__copy">
              <p className="planner-headline__eyebrow">Planner Studio</p>
              <h2 className="planner-headline__title">Design the live planning experience</h2>
              <p className="planner-headline__subtitle">
                Tune pricing, collections, and onboarding that power the public planner flow.
              </p>
            </div>
            <div className="planner-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={plannerEnabled}
                  onChange={event => setPlannerEnabled(event.target.checked)}
                />
                <span>Display planner on the public site</span>
              </label>
              <p className="help-text">Toggle this off to route visitors to the contact form instead of the live planner.</p>
            </div>
          </div>
          <div className="planner-summary-grid">
            {plannerSummaryCards.map(card => (
              <div key={card.label} className="planner-stat">
                <span className="planner-stat__value">{card.value}</span>
                <span className="planner-stat__label">{card.label}</span>
                <span className="planner-stat__hint">{card.helper}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="planner-admin-layout">
          <aside className="planner-nav">
            <p className="planner-nav__title">Jump to section</p>
            <div className="planner-nav__list">
              {plannerSectionsMeta.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  className={`planner-nav__item${activeSectionId === section.id ? ' active' : ''}`}
                  onClick={() => scrollToSection(section.id)}
                >
                  <span className="planner-nav__index">{index + 1}</span>
                  <span className="planner-nav__label">
                    <span className="planner-nav__label-title">{section.label}</span>
                    <span className="planner-nav__label-sub">{section.subtitle}</span>
                  </span>
                  <span className="planner-nav__count">{section.count}</span>
                </button>
              ))}
            </div>
            <div className="planner-nav__actions">
              <p className="planner-nav__actions-title">Quick actions</p>
              <div className="planner-quick-grid">
                {plannerQuickActions.map(action => (
                  <button key={action.label} type="button" className="planner-quick-button" onClick={action.onClick}>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          <div className="planner-content">
            {error && <div className="message error">{error}</div>}
            {success && <div className="message success">{success}</div>}
            {loading && <div className="message info">Refreshing planner settings...</div>}

            <section
              id="planner-section-celebrations"
              ref={registerSectionRef('planner-section-celebrations')}
              className="planner-section"
            >
              <header className="planner-section__header">
                <div className="planner-section__title">
                  <h3>Event celebration styles</h3>
                  <span className="planner-count-badge">{eventTypes.length}</span>
                </div>
                <button type="button" className="btn btn-secondary" onClick={addEventType}>
                  Add event style
                </button>
              </header>
              <p className="planner-section__description">These options appear as the first step in the planner. Include pricing per guest and the headline highlight.</p>
              {eventTypes.length === 0 && <p className="empty-note">No event styles yet. Add one to get started.</p>}
              {eventTypes.map((item, index) => (
                <div key={item.id || index} className="planner-card">
                  <div className="card-header">
                    <h4>Event {index + 1}</h4>
                    <button type="button" className="btn btn-danger btn-small" onClick={() => removeEventType(index)}>
                      Remove
                    </button>
                  </div>
                  <div className="field-grid">
                    <label className="field">
                      <span>Name</span>
                      <input value={item.name} onChange={event => updateEventType(index, 'name', event.target.value)} required />
                    </label>
                    <label className="field">
                      <span>Price per guest (CA$)</span>
                      <input type="number" min="0" value={item.pricePerGuest} onChange={event => updateEventType(index, 'pricePerGuest', event.target.value)} />
                    </label>
                  </div>
                  <label className="field">
                    <span>Highlight</span>
                    <input
                      value={item.highlight}
                      onChange={event => updateEventType(index, 'highlight', event.target.value)}
                      placeholder="Royal hospitality for multi-day festivities"
                    />
                  </label>
                  <label className="field">
                    <span>Description</span>
                    <textarea rows={3} value={item.description} onChange={event => updateEventType(index, 'description', event.target.value)} />
                  </label>
                </div>
              ))}
            </section>

            <section
              id="planner-section-service-levels"
              ref={registerSectionRef('planner-section-service-levels')}
              className="planner-section"
            >
              <header className="planner-section__header">
                <div className="planner-section__title">
                  <h3>Service levels</h3>
                  <span className="planner-count-badge">{serviceLevels.length}</span>
                </div>
                <button type="button" className="btn btn-secondary" onClick={addServiceLevel}>
                  Add service level
                </button>
              </header>
              <p className="planner-section__description">Control staffing style and per-guest pricing tiers.</p>
              {serviceLevels.length === 0 && <p className="empty-note">No service levels configured.</p>}
              {serviceLevels.map((item, index) => (
                <div key={item.id || index} className="planner-card">
                  <div className="card-header">
                    <h4>Service level {index + 1}</h4>
                    <button type="button" className="btn btn-danger btn-small" onClick={() => removeServiceLevel(index)}>
                      Remove
                    </button>
                  </div>
                  <div className="field-grid">
                    <label className="field">
                      <span>Name</span>
                      <input value={item.name} onChange={event => updateServiceLevel(index, 'name', event.target.value)} required />
                    </label>
                    <label className="field">
                      <span>Price per guest (CA$)</span>
                      <input type="number" min="0" value={item.pricePerGuest} onChange={event => updateServiceLevel(index, 'pricePerGuest', event.target.value)} />
                    </label>
                  </div>
                  <label className="field">
                    <span>Description</span>
                    <textarea rows={3} value={item.description} onChange={event => updateServiceLevel(index, 'description', event.target.value)} />
                  </label>
                </div>
              ))}
            </section>

            <section
              id="planner-section-menu-collections"
              ref={registerSectionRef('planner-section-menu-collections')}
              className="planner-section"
            >
              <header className="planner-section__header">
                <div className="planner-section__title">
                  <h3>Menu collections</h3>
                  <span className="planner-count-badge">{menuCollections.length}</span>
                </div>
                <button type="button" className="btn btn-secondary" onClick={addMenuCollection}>
                  Add menu collection
                </button>
              </header>
              <p className="planner-section__description">These are the curated menu stories guests can choose from. Use course groups to control which dishes show in each section.</p>
              {menuCollections.length === 0 && <p className="empty-note">No menu collections configured.</p>}
              {menuCollections.map((collection, index) => (
                <div key={collection.id || index} className="planner-card">
                  <div className="card-header">
                    <h4>Collection {index + 1}</h4>
                    <div className="card-actions">
                      <button type="button" className="btn btn-secondary btn-small" onClick={() => addCourseGroup(index)}>
                        Add course group
                      </button>
                      <button type="button" className="btn btn-danger btn-small" onClick={() => removeMenuCollection(index)}>
                        Remove collection
                      </button>
                    </div>
                  </div>
                  <div className="field-grid">
                    <label className="field">
                      <span>Name</span>
                      <input value={collection.name} onChange={event => updateCollectionField(index, 'name', event.target.value)} required />
                    </label>
                    <label className="field">
                      <span>Price per guest (CA$)</span>
                      <input type="number" min="0" value={collection.pricePerGuest} onChange={event => updateCollectionField(index, 'pricePerGuest', event.target.value)} />
                    </label>
                  </div>
                  <label className="field">
                    <span>Headline</span>
                    <input value={collection.headline} onChange={event => updateCollectionField(index, 'headline', event.target.value)} />
                  </label>
                  <div className="course-group-grid">
                    {Object.entries(collection.courses).map(([courseKey, value]) => (
                      <div key={courseKey} className="field">
                        <div className="course-label">
                          <span>{courseKey}</span>
                          <button type="button" className="btn-link" onClick={() => removeCourseGroup(index, courseKey)}>
                            Remove
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          value={value}
                          placeholder="One dish per line"
                          onChange={event => updateCollectionCourse(index, courseKey, event.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section
              id="planner-section-addons"
              ref={registerSectionRef('planner-section-addons')}
              className="planner-section"
            >
              <header className="planner-section__header">
                <div className="planner-section__title">
                  <h3>Experience add-ons</h3>
                  <span className="planner-count-badge">{experienceAddons.length}</span>
                </div>
                <button type="button" className="btn btn-secondary" onClick={addExperienceAddon}>
                  Add add-on
                </button>
              </header>
              <p className="planner-section__description">Enhancements that guests can bundle with their celebration. Prices can be per guest or flat.</p>
              {experienceAddons.length === 0 && <p className="empty-note">No experiential add-ons configured.</p>}
              {experienceAddons.map((addon, index) => (
                <div key={addon.id || index} className="planner-card">
                  <div className="card-header">
                    <h4>Add-on {index + 1}</h4>
                    <button type="button" className="btn btn-danger btn-small" onClick={() => removeExperienceAddon(index)}>
                      Remove
                    </button>
                  </div>
                  <div className="field-grid">
                    <label className="field">
                      <span>Name</span>
                      <input value={addon.name} onChange={event => updateExperienceAddon(index, 'name', event.target.value)} required />
                    </label>
                    <label className="field">
                      <span>Price (CA$)</span>
                      <input type="number" min="0" value={addon.price} onChange={event => updateExperienceAddon(index, 'price', event.target.value)} />
                    </label>
                    <label className="field">
                      <span>Pricing type</span>
                      <select value={addon.type} onChange={event => updateExperienceAddon(index, 'type', event.target.value)}>
                        <option value="per_person">Per guest</option>
                        <option value="flat">Flat</option>
                      </select>
                    </label>
                  </div>
                  <label className="field">
                    <span>Description</span>
                    <textarea rows={3} value={addon.description} onChange={event => updateExperienceAddon(index, 'description', event.target.value)} />
                  </label>
                </div>
              ))}
            </section>

            <section
              id="planner-section-menu-builder"
              ref={registerSectionRef('planner-section-menu-builder')}
              className="planner-section"
            >
              <header className="planner-section__header">
                <div className="planner-section__title">
                  <h3>Menu builder categories</h3>
                  <span className="planner-count-badge">{menuCategories.length}</span>
                </div>
                <button type="button" className="btn btn-secondary" onClick={addMenuCategory}>
                  Add category
                </button>
              </header>
              <p className="planner-section__description">
                Link planner categories to catalogue categories so guests can pick dishes directly from your published
                catalogue.
              </p>
              {menuCategories.length === 0 && <p className="empty-note">No categories configured.</p>}
              {menuCategories.map((category, index) => (
                <div key={category.id || index} className="planner-card">
                  <div className="card-header">
                    <h4>Category {index + 1}</h4>
                    <button type="button" className="btn btn-danger btn-small" onClick={() => removeMenuCategory(index)}>
                      Remove
                    </button>
                  </div>
                  <div className="field-grid">
                    <label className="field">
                      <span>Label</span>
                      <input value={category.label} onChange={event => updateMenuCategory(index, 'label', event.target.value)} required />
                    </label>
                    <label className="field">
                      <span>Max selections</span>
                      <input type="number" min="0" value={category.maxSelections} onChange={event => updateMenuCategory(index, 'maxSelections', event.target.value)} />
                    </label>
                    <label className="field">
                      <span>Min selections</span>
                      <input type="number" min="0" value={category.minSelections} onChange={event => updateMenuCategory(index, 'minSelections', event.target.value)} />
                    </label>
                  </div>
                  <label className="field">
                    <span>Description</span>
                    <textarea rows={2} value={category.description} onChange={event => updateMenuCategory(index, 'description', event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Catalogue categories</span>
                    <select
                      multiple
                      disabled={catalogueCategoryOptions.length === 0}
                      size={Math.min(8, Math.max(4, catalogueCategoryOptions.length || 4))}
                      value={category.categoryIds}
                      onChange={event =>
                        updateMenuCategory(
                          index,
                          'categoryIds',
                          Array.from(event.target.selectedOptions).map(option => option.value),
                        )
                      }
                    >
                      {catalogueCategoryOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {catalogueCategoryOptions.length === 0 ? (
                      <span className="help-text">
                        No catalogue categories found. Add categories in the catalogue tab to power menu selections.
                      </span>
                    ) : (
                      <span className="help-text">
                        Hold Ctrl (Windows) or Command (Mac) to select multiple categories.
                      </span>
                    )}
                  </label>
                  <div className="field">
                    <span>Include child categories</span>
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={category.includeChildCategories !== false}
                        onChange={event => updateMenuCategory(index, 'includeChildCategories', event.target.checked)}
                      />
                      <span>Auto-include dishes from linked sub-categories</span>
                    </label>
                  </div>
                  <label className="field">
                    <span>Tier filter</span>
                    <select
                      value={category.tierFilter || 'all'}
                      onChange={event => updateMenuCategory(index, 'tierFilter', event.target.value)}
                    >
                      <option value="all">All tiers</option>
                      <option value="standard">Standard only</option>
                      <option value="premium">Premium only</option>
                      <option value="signature">Signature only</option>
                    </select>
                  </label>
                </div>
              ))}
            </section>

            <section
              id="planner-section-onboarding"
              ref={registerSectionRef('planner-section-onboarding')}
              className="planner-section"
            >
              <header className="planner-section__header">
                <div className="planner-section__title">
                  <h3>Onboarding checklist</h3>
                  <span className="planner-count-badge">{onboardingItemsCount}</span>
                </div>
              </header>
              <p className="planner-section__description">Shown after submission to reassure clients what happens next.</p>
              <label className="field">
                <span>Checklist items</span>
                <textarea rows={4} value={checklistText} onChange={event => setChecklistText(event.target.value)} />
              </label>
            </section>
          </div>
        </div>

        <div className="planner-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save planner settings'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={saving}>
            Reset to defaults
          </button>
        </div>
      </form>
    </div>
  )
}












