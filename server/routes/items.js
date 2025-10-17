const express = require('express');
const Item = require('../models/Item');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all items with filtering
router.get('/', async (req, res) => {
  try {
    const { type, category, status = 'active', search, limit = 20 } = req.query;
    
    const query = { status };
    if (type) query.type = type;
    if (category) query.category = category;
    
    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query)
      .populate('postedBy', 'name email picture')
      .sort({ dateReported: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('postedBy', 'name email picture');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, type, location, dateOccurred, phone } = req.body;

    const newItem = new Item({
      title,
      description,
      category,
      type,
      location,
      dateOccurred,
      postedBy: req.user._id,
      contactInfo: {
        email: req.user.email,
        phone
      }
    });

    await newItem.save();
    await newItem.populate('postedBy', 'name email picture');

    res.status(201).json({
      success: true,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item posted successfully`,
      data: newItem
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get user's items
router.get('/user/my-items', authenticateToken, async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user._id })
      .sort({ dateReported: -1 });

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update item status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    item.status = status;
    await item.save();

    res.json({ success: true, message: 'Item status updated', data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
