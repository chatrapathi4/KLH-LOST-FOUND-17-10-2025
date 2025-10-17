const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  category: { 
    type: String, 
    required: true,
    enum: ['electronics', 'clothing', 'books', 'accessories', 'documents', 'keys', 'bags', 'other']
  },
  type: { 
    type: String, 
    required: true,
    enum: ['lost', 'found']
  },
  location: { 
    type: String, 
    required: true,
    trim: true
  },
  dateReported: { 
    type: Date, 
    default: Date.now 
  },
  dateOccurred: { 
    type: Date, 
    required: true 
  },
  images: [{ 
    type: String // We'll add Cloudinary later
  }],
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'claimed', 'resolved'],
    default: 'active'
  },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String }
  }
});

// Indexes for better performance
itemSchema.index({ type: 1, status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ dateReported: -1 });

module.exports = mongoose.model('Item', itemSchema);
