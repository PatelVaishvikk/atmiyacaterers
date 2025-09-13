'use client';

import { useState } from 'react';

export default function BookingsManagement({ items, setItems, showMessage, loading }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showMessage(result.message);
        setItems(items.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        ));
      }
    } catch (error) {
      showMessage('Error updating booking status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
          showMessage(result.message);
          setItems(items.filter(item => item._id !== id));
        }
      } catch (error) {
        showMessage('Error deleting booking', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="management-section">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, token, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Bookings</option>
          <option value="booked">Booked</option>
          <option value="checked-in">Checked In</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="items-list">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No bookings found
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item._id} className="item-card">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold">{item.name}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>Token:</strong> <span className="font-mono font-bold text-blue-600">{item.tokenNumber}</span></p>
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>Phone:</strong> {item.phone}</p>
                </div>
                <div>
                  <p><strong>Date:</strong> {new Date(item.bookingDate).toLocaleDateString()}</p>
                  <p><strong>People:</strong> {item.numberOfPeople}</p>
                  <p><strong>Event:</strong> {item.eventType}</p>
                </div>
              </div>

              {item.specialRequests && (
                <p className="mb-3"><strong>Special Requests:</strong> {item.specialRequests}</p>
              )}

              {item.checkedInAt && (
                <p className="mb-3 text-sm text-gray-600">
                  <strong>Checked in:</strong> {new Date(item.checkedInAt).toLocaleString()}
                  {item.checkedInBy && ` by ${item.checkedInBy}`}
                </p>
              )}

              <div className="item-actions">
                {item.status === 'booked' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleStatusChange(item._id, 'checked-in')}
                  >
                    Check In
                  </button>
                )}
                
                {item.status === 'checked-in' && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleStatusChange(item._id, 'booked')}
                  >
                    Undo Check In
                  </button>
                )}

                {item.status !== 'cancelled' && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleStatusChange(item._id, 'cancelled')}
                  >
                    Cancel
                  </button>
                )}

                {item.status === 'cancelled' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleStatusChange(item._id, 'booked')}
                  >
                    Reactivate
                  </button>
                )}

                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
