import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginComponent = ({ onLoginSuccess }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    
    console.log('Google credential received:', credentialResponse);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      
      console.log('Server response status:', response.status);
      
      const data = await response.json();
      console.log('Server response data:', data);
      
      if (response.ok && data.success) {
        localStorage.setItem('authToken', data.token);
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    console.error('Google OAuth error:', error);
    setError('Google authentication failed. Please try again.');
  };

  return (
    <div style={{
      /* make this wrapper span the full viewport width so the background is full-page */
      width: '100vw',
      marginLeft: 'calc(50% - 50vw)',
      boxSizing: 'border-box',

      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      minHeight: '100vh',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h1 style={{
          fontSize: '24px',
          marginBottom: '10px',
          color: '#333'
        }}>
          🎓 KLH Lost & Found System
        </h1>

        <p style={{
          color: '#666',
          marginBottom: '30px'
        }}>
          Sign in with your KLH email address
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <strong>Error:</strong> {error}
            <br />
            <small>
              {error.includes('Network') ?
                'Make sure the server is running on port 5000' :
                'Please use your @klh.edu.in email address'
              }
            </small>
          </div>
        )}

        {isLoading ? (
          <div style={{ padding: '20px' }}>
            <div>Signing in...</div>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            theme="outline"
            size="large"
            auto_select={false}
          />
        )}

        <p style={{
          fontSize: '12px',
          color: '#999',
          marginTop: '20px'
        }}>
          Only KLH students can access this platform
        </p>
      </div>
    </div>
  );
};

export default GoogleLoginComponent;
