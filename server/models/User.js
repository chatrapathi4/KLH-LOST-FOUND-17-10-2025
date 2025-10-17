const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /@klh\.edu\.in$/ // Only KLH emails
  },
  name: { 
    type: String, 
    required: true 
  },
  picture: { 
    type: String 
  },
  domain: { 
    type: String, 
    required: true,
    default: 'klh.edu.in'
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

module.exports = mongoose.model('User', userSchema);
