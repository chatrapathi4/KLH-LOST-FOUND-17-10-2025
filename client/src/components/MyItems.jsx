import React, { useState, useEffect } from 'react';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/items/user/my-items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setItems(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (itemId, status) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/items/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const result = await response.json();
      if (result.success) {
        setItems(items.map(item => 
          item._id === itemId ? { ...item, status } : item
        ));
        alert('Item status updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update item status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'claimed': return '#ffc107';
      case 'resolved': return '#6c757d';
      default: return '#007bff';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🔴';
      case 'claimed': return '🟡';
      case 'resolved': return '✅';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading your items...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2>📋 My Posted Items</h2>
        <p style={{ color: '#666', margin: '5px 0' }}>
          Manage your lost and found item postings
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
          <h3>No items posted yet</h3>
          <p>Start by posting a lost or found item to help the KLH community!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {items.map(item => (
            <div
              key={item._id}
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '20px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px'
                  }}>
                    <span style={{ fontSize: '20px' }}>
                      {item.type === 'lost' ? '📉' : '📈'}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '20px' }}>
                      {item.title}
                    </h3>
                    <span style={{
                      backgroundColor: item.type === 'lost' ? '#dc3545' : '#28a745',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>

                  <p style={{
                    margin: '0 0 15px 0',
                    color: '#666',
                    lineHeight: '1.5'
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    <div>
                      <strong>📍 Location:</strong> {item.location}
                    </div>
                    <div>
                      <strong>📅 Date:</strong> {formatDate(item.dateOccurred)}
                    </div>
                    <div>
                      <strong>🏷️ Category:</strong> {item.category}
                    </div>
                    <div>
                      <strong>📝 Posted:</strong> {formatDate(item.dateReported)}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '10px',
                  marginLeft: '20px'
                }}>
                  {/* Status */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: getStatusColor(item.status),
                    fontWeight: '500'
                  }}>
                    <span>{getStatusIcon(item.status)}</span>
                    <span>{item.status.toUpperCase()}</span>
                  </div>

                  {/* Status Actions */}
                  {item.status === 'active' && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => updateItemStatus(item._id, 'claimed')}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#ffc107',
                          color: 'black',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Mark as Claimed
                      </button>
                      <button
                        onClick={() => updateItemStatus(item._id, 'resolved')}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  )}

                  {item.status === 'claimed' && (
                    <button
                      onClick={() => updateItemStatus(item._id, 'resolved')}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div style={{
                paddingTop: '15px',
                borderTop: '1px solid #eee',
                fontSize: '12px',
                color: '#666'
              }}>
                <strong>Contact:</strong> {item.contactInfo.email}
                {item.contactInfo.phone && (
                  <span> • {item.contactInfo.phone}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItems;
