const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject, message]
    );

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all contact messages (admin only)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark message as read (admin only)
router.put('/:id/read', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE contact_messages SET is_read = TRUE WHERE id = $1',
      [id]
    );

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;