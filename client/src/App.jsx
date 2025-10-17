import { useState, useEffect } from 'react';
import GoogleLoginComponent from './components/GoogleLogin';
import PostItem from './components/PostItem';
import BrowseItems from './components/BrowseItems';
import MyItems from './components/MyItems';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Failed to verify token:', error);
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setActiveTab('browse');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'post':
        return <PostItem onItemPosted={() => setActiveTab('my-items')} />;
      case 'my-items':
        return <MyItems />;
      case 'browse':
      default:
        return <BrowseItems />;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <GoogleLoginComponent onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        padding: '15px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo */}
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              🎓 KLH Lost & Found
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { id: 'browse', label: 'Browse', icon: '🔍' },
                { id: 'post', label: 'Post Item', icon: '📝' },
                { id: 'my-items', label: 'My Items', icon: '📋' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: activeTab === tab.id ? '#007bff' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#333',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ marginRight: 8 }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* User Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={user.picture} 
                alt={user.name}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%'
                }}
              />
              <span style={{ fontSize: '14px', color: '#666' }}>
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #dc3545',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  color: '#dc3545',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;
