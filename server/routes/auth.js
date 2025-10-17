const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth Login with debug logging
router.post('/google', async (req, res) => {
  console.log('🔍 Auth request received');
  console.log('Request body:', req.body);
  console.log('Google Client ID from env:', process.env.GOOGLE_CLIENT_ID);
  
  try {
    const { token } = req.body;
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(400).json({ 
        success: false,
        error: 'No token provided',
        message: 'Authentication token is required'
      });
    }
    
    console.log('🔍 Verifying Google token...');
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    console.log('✅ Google token verified');
    console.log('User payload:', {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      hd: payload.hd
    });
    
    // Check KLH domain restriction
    if (!payload.email.endsWith('@klh.edu.in')) {
      console.log('❌ Domain restriction failed:', payload.email);
      return res.status(403).json({ 
        success: false,
        error: 'Access Denied',
        message: 'Only KLH students can access this platform. Please use your @klh.edu.in email address.',
        emailUsed: payload.email
      });
    }
    
    console.log('✅ Domain check passed');
    
    // Create or find user
    let user = await User.findOne({ googleId: payload.sub });
    
    if (!user) {
      console.log('🆕 Creating new user');
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        domain: 'klh.edu.in'
      });
      await user.save();
      console.log('✅ New user created');
    } else {
      console.log('✅ Existing user found');
    }
    
    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('✅ JWT token generated');
    
    res.json({
      success: true,
      message: 'Login successful',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
    
  } catch (error) {
    console.log('❌ Authentication error:', error.message);
    console.log('Error details:', error);
    res.status(400).json({ 
      success: false,
      error: 'Authentication failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
