const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// List testimonials (API)
router.get('/', async (req, res) => {
  try {
    const list = await Testimonial.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create testimonial
router.post('/', async (req, res) => {
  try {
    const { author, text, rating } = req.body;
    const t = new Testimonial({ author, text, rating });
    await t.save();
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create' });
  }
});

module.exports = router;
