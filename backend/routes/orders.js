const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Razorpay = require('razorpay');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order for payment
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { projectId, paymentMethod } = req.body;
    const userId = req.user.id;

    // Get project details
    const projectResult = await pool.query(
      'SELECT id, title, price FROM projects WHERE id = $1 AND is_active = TRUE',
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Check if user already owns this project
    const existingPurchase = await pool.query(
      'SELECT id FROM user_downloads WHERE user_id = $1 AND project_id = $2',
      [userId, projectId]
    );

    if (existingPurchase.rows.length > 0) {
      return res.status(400).json({ error: 'You already own this project' });
    }

    let paymentData;

    if (paymentMethod === 'razorpay') {
      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(project.price * 100), // Amount in paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          projectId: project.id,
          userId: userId,
          projectTitle: project.title
        }
      });

      paymentData = {
        orderId: razorpayOrder.id,
        amount: project.price,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID
      };
    } else if (paymentMethod === 'stripe') {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(project.price * 100), // Amount in cents
        currency: 'inr',
        metadata: {
          projectId: project.id,
          userId: userId,
          projectTitle: project.title
        }
      });

      paymentData = {
        clientSecret: paymentIntent.client_secret,
        amount: project.price,
        currency: 'INR'
      };
    }

    res.json({
      project: {
        id: project.id,
        title: project.title,
        price: parseFloat(project.price)
      },
      payment: paymentData
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify payment and complete order
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { paymentId, orderId, signature, projectId, paymentMethod } = req.body;
    const userId = req.user.id;

    let isPaymentValid = false;

    if (paymentMethod === 'razorpay') {
      // Verify Razorpay payment
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + '|' + paymentId)
        .digest('hex');

      isPaymentValid = expectedSignature === signature;
    } else if (paymentMethod === 'stripe') {
      // Verify Stripe payment
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        isPaymentValid = paymentIntent.status === 'succeeded';
      } catch (error) {
        isPaymentValid = false;
      }
    }

    if (!isPaymentValid) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Get project details
    const projectResult = await pool.query(
      'SELECT id, title, price, download_link FROM projects WHERE id = $1',
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Create order record
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, project_id, amount, payment_id, payment_status, payment_method) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [userId, projectId, project.price, paymentId, 'completed', paymentMethod]
    );

    const orderId_db = orderResult.rows[0].id;

    // Grant download access
    await pool.query(
      'INSERT INTO user_downloads (user_id, project_id, order_id) VALUES ($1, $2, $3)',
      [userId, projectId, orderId_db]
    );

    res.json({
      message: 'Payment successful',
      downloadLink: project.download_link,
      orderId: orderId_db
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's purchased projects
router.get('/my-purchases', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT 
        p.id, p.title, p.thumbnail_url, p.download_link,
        o.created_at as purchase_date, o.amount,
        ud.download_count, ud.last_downloaded_at
      FROM user_downloads ud
      JOIN projects p ON ud.project_id = p.id
      JOIN orders o ON ud.order_id = o.id
      WHERE ud.user_id = $1
      ORDER BY o.created_at DESC
    `, [userId]);

    const purchases = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      thumbnail: row.thumbnail_url,
      downloadLink: row.download_link,
      purchaseDate: row.purchase_date,
      amount: parseFloat(row.amount),
      downloadCount: row.download_count,
      lastDownloaded: row.last_downloaded_at
    }));

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download project (for purchased projects)
router.get('/download/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user owns this project
    const accessResult = await pool.query(
      'SELECT ud.id, p.download_link, p.title FROM user_downloads ud JOIN projects p ON ud.project_id = p.id WHERE ud.user_id = $1 AND ud.project_id = $2',
      [userId, projectId]
    );

    if (accessResult.rows.length === 0) {
      return res.status(403).json({ error: 'You do not have access to this project' });
    }

    const download = accessResult.rows[0];

    // Update download count and timestamp
    await pool.query(
      'UPDATE user_downloads SET download_count = download_count + 1, last_downloaded_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND project_id = $2',
      [userId, projectId]
    );

    res.json({
      downloadLink: download.download_link,
      projectTitle: download.title
    });
  } catch (error) {
    console.error('Error processing download:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders (admin only)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id, o.amount, o.payment_status, o.payment_method, o.created_at,
        u.name as user_name, u.email as user_email,
        p.title as project_title
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN projects p ON o.project_id = p.id
      ORDER BY o.created_at DESC
    `);

    const orders = result.rows.map(row => ({
      id: row.id,
      amount: parseFloat(row.amount),
      paymentStatus: row.payment_status,
      paymentMethod: row.payment_method,
      createdAt: row.created_at,
      user: {
        name: row.user_name,
        email: row.user_email
      },
      project: {
        title: row.project_title
      }
    }));

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;