import React, { useState, useEffect } from 'react';

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: ''
  });

  const categories = [
    'electronics', 'clothing', 'books', 'accessories', 
    'documents', 'keys', 'bags', 'other'
  ];

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.search) queryParams.append('search', filters.search);

        const response = await fetch(`http://localhost:5000/api/items?${queryParams}`);
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

    fetchItems();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getItemIcon = (type) => {
    return type === 'lost' ? '📉' : '📈';
  };

  const getItemColor = (type) => {
    return type === 'lost' ? '#dc3545' : '#28a745';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading items...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Filters */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>🔍 Browse Lost & Found Items</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search items..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            >
              <option value="">All Types</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setFilters({ type: '', category: '', search: '' })}
            style={{
              padding: '8px 15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Found {items.length} items
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
          <h3>No items found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {items.map(item => (
            <div
              key={item._id}
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Header */}
              <div style={{
                backgroundColor: getItemColor(item.type),
                color: 'white',
                padding: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{getItemIcon(item.type)}</span>
                  <span style={{ fontWeight: '500' }}>
                    {item.type === 'lost' ? 'LOST' : 'FOUND'}
                  </span>
                </div>
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {item.category}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                  {item.title}
                </h3>
                
                <p style={{
                  margin: '0 0 15px 0',
                  color: '#666',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.description}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <div>
                    <strong>📍 Location:</strong><br/>
                    {item.location}
                  </div>
                  <div>
                    <strong>📅 Date:</strong><br/>
                    {formatDate(item.dateOccurred)}
                  </div>
                </div>

                {/* Posted by */}
                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <img
                    src={item.postedBy.picture}
                    alt={item.postedBy.name}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%'
                    }}
                  />
                  <span>Posted by {item.postedBy.name}</span>
                  <span style={{ marginLeft: 'auto' }}>
                    {formatDate(item.dateReported)}
                  </span>
                </div>

                {/* Contact Button */}
                <button
                  onClick={() => {
                    window.location.href = `mailto:${item.contactInfo.email}?subject=Regarding ${item.type} ${item.title}&body=Hi, I saw your post about the ${item.type} ${item.title}. `;
                  }}
                  style={{
                    width: '100%',
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  📧 Contact Owner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseItems;
