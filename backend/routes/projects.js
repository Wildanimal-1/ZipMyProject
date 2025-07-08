const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all active projects (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, short_description, price, thumbnail_url, screenshots, created_at FROM projects WHERE is_active = TRUE ORDER BY created_at DESC'
    );

    const projects = result.rows.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      shortDescription: project.short_description,
      price: parseFloat(project.price),
      thumbnail: project.thumbnail_url,
      screenshots: project.screenshots || [],
      createdAt: project.created_at
    }));

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND is_active = TRUE',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = result.rows[0];
    res.json({
      id: project.id,
      title: project.title,
      description: project.description,
      shortDescription: project.short_description,
      price: parseFloat(project.price),
      thumbnail: project.thumbnail_url,
      screenshots: project.screenshots || [],
      downloadLink: project.download_link,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new project (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, shortDescription, price, thumbnailUrl, screenshots, downloadLink } = req.body;

    if (!title || !description || !shortDescription || !price) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = await pool.query(
      'INSERT INTO projects (title, description, short_description, price, thumbnail_url, screenshots, download_link) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, shortDescription, price, thumbnailUrl, JSON.stringify(screenshots), downloadLink]
    );

    const project = result.rows[0];
    res.status(201).json({
      id: project.id,
      title: project.title,
      description: project.description,
      shortDescription: project.short_description,
      price: parseFloat(project.price),
      thumbnail: project.thumbnail_url,
      screenshots: project.screenshots || [],
      downloadLink: project.download_link,
      createdAt: project.created_at
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, shortDescription, price, thumbnailUrl, screenshots, downloadLink } = req.body;

    const result = await pool.query(
      'UPDATE projects SET title = $1, description = $2, short_description = $3, price = $4, thumbnail_url = $5, screenshots = $6, download_link = $7 WHERE id = $8 RETURNING *',
      [title, description, shortDescription, price, thumbnailUrl, JSON.stringify(screenshots), downloadLink, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = result.rows[0];
    res.json({
      id: project.id,
      title: project.title,
      description: project.description,
      shortDescription: project.short_description,
      price: parseFloat(project.price),
      thumbnail: project.thumbnail_url,
      screenshots: project.screenshots || [],
      downloadLink: project.download_link,
      updatedAt: project.updated_at
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE projects SET is_active = FALSE WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;