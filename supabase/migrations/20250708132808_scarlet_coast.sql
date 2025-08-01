-- ZipMyProject Database Schema
-- Complete PostgreSQL setup for project selling website

-- Create database (run this first)
-- CREATE DATABASE ZipMyProject;

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table for storing project information
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    thumbnail_url VARCHAR(500),
    screenshots JSONB, -- Array of screenshot URLs
    download_link VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table for tracking purchases
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_id VARCHAR(255) UNIQUE NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    payment_method VARCHAR(50), -- razorpay, stripe
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User downloads table (track what users have purchased)
CREATE TABLE user_downloads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    download_count INTEGER DEFAULT 0,
    first_downloaded_at TIMESTAMP,
    last_downloaded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, project_id)
);

-- Contact messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_active ON projects(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_user_downloads_user_id ON user_downloads(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
-- Note: In production, hash this password properly
INSERT INTO users (name, email, password_hash, is_admin) VALUES 
('Admin', 'admin@ZipMyProject.in', '$2b$10$rQZ8kHWKtGkVQGOoVQGOoOQGOoVQGOoVQGOoVQGOoVQGOoVQGOoVQ', TRUE);

-- Insert sample projects
INSERT INTO projects (title, description, short_description, price, thumbnail_url, screenshots, download_link) VALUES 
(
    'E-Commerce Website',
    'A full-stack e-commerce website built with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard. Perfect for learning modern web development concepts.',
    'Full-stack e-commerce website with React and Node.js',
    2999.00,
    'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=500',
    '["https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"]',
    '#'
),
(
    'Task Management App',
    'A React-based task management application with drag-and-drop functionality, user authentication, and real-time updates. Includes features like task categorization, due dates, priority levels, and team collaboration.',
    'React task management app with drag-and-drop',
    1999.00,
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=500',
    '["https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"]',
    '#'
),
(
    'Social Media Dashboard',
    'A comprehensive social media dashboard built with Vue.js and PostgreSQL. Features include analytics, post scheduling, user engagement tracking, and multi-platform integration. Great for understanding modern frontend frameworks.',
    'Vue.js social media dashboard with PostgreSQL',
    3499.00,
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=500',
    '["https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800"]',
    '#'
);