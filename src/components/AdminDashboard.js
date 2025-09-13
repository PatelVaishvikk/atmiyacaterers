'use client';

import { useState, useEffect } from 'react';
import BookingsManagement from './BookingsManagement';

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/admin/test');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        setTestResult({ error: 'Empty response from server' });
        return;
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error for test API:', parseError);
        console.error('Response text:', text);
        setTestResult({ error: 'Invalid JSON response from server' });
        return;
      }
      
      setTestResult(data);
    } catch (error) {
      console.error('Database connection test error:', error);
      setTestResult({ error: 'Failed to test connection', details: error.message });
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

  const showMessage = (msg, type = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  useEffect(() => {
    if (activeSection === 'menu') fetchData('menu', setMenuItems);
    if (activeSection === 'services') fetchData('services', setServices);
    if (activeSection === 'gallery') fetchData('gallery', setGalleryItems);
    if (activeSection === 'testimonials') fetchData('testimonials', setTestimonials);
    if (activeSection === 'events') fetchData('events', setEvents);
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
  }, [activeSection]);

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
          <p>Database Connection: {testResult?.success ? '✅ Connected' : '❌ Disconnected'}</p>
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
              placeholder="Price (e.g., ₹150)"
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