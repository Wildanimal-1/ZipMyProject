/*
  # Create ZipMyProject Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Supabase auth.users
      - `name` (text)
      - `email` (text, unique)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `projects`
      - `id` (serial, primary key)
      - `title` (text)
      - `description` (text)
      - `short_description` (text)
      - `price` (decimal)
      - `thumbnail_url` (text)
      - `screenshots` (jsonb)
      - `download_link` (text)
      - `demo_url` (text)
      - `tech_stack` (jsonb)
      - `features` (jsonb)
      - `is_popular` (boolean, default false)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders`
      - `id` (serial, primary key)
      - `user_id` (uuid, foreign key)
      - `project_id` (integer, foreign key)
      - `amount` (decimal)
      - `payment_id` (text, unique)
      - `payment_status` (text, default 'pending')
      - `payment_method` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_downloads`
      - `id` (serial, primary key)
      - `user_id` (uuid, foreign key)
      - `project_id` (integer, foreign key)
      - `order_id` (integer, foreign key)
      - `download_count` (integer, default 0)
      - `first_downloaded_at` (timestamp)
      - `last_downloaded_at` (timestamp)
      - `created_at` (timestamp)
    
    - `contact_messages`
      - `id` (serial, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `is_read` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own data
    - Add policies for admins to manage all data
*/

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  price decimal(10,2) NOT NULL,
  thumbnail_url text,
  screenshots jsonb DEFAULT '[]'::jsonb,
  download_link text,
  demo_url text,
  tech_stack jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb,
  is_popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id integer REFERENCES projects(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  payment_id text UNIQUE NOT NULL,
  payment_status text DEFAULT 'pending',
  payment_method text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_downloads table
CREATE TABLE IF NOT EXISTS user_downloads (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id integer REFERENCES projects(id) ON DELETE CASCADE,
  order_id integer REFERENCES orders(id) ON DELETE CASCADE,
  download_count integer DEFAULT 0,
  first_downloaded_at timestamptz,
  last_downloaded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_popular ON projects(is_popular);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_user_downloads_user_id ON user_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Projects policies
CREATE POLICY "Anyone can read active projects" ON projects FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage projects" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Orders policies
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can read all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- User downloads policies
CREATE POLICY "Users can read own downloads" ON user_downloads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create downloads" ON user_downloads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own downloads" ON user_downloads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all downloads" ON user_downloads FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Contact messages policies
CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read all contact messages" ON contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update contact messages" ON contact_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Insert sample data
INSERT INTO projects (title, description, short_description, price, thumbnail_url, screenshots, tech_stack, features, is_popular) VALUES
(
  'E-Commerce Website with React & Node.js',
  'A complete full-stack e-commerce solution built with React.js frontend and Node.js backend. Features include user authentication, product catalog, shopping cart, payment integration with Stripe, order management, and admin dashboard. Perfect for learning modern web development practices.',
  'Full-stack e-commerce website with React, Node.js, and Stripe integration',
  2999.00,
  'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '["React", "Node.js", "MongoDB", "Express", "Stripe"]'::jsonb,
  '["User Authentication & Authorization", "Product Catalog with Search & Filters", "Shopping Cart & Wishlist", "Stripe Payment Integration", "Order Management System", "Admin Dashboard", "Responsive Design", "Email Notifications"]'::jsonb,
  true
),
(
  'Machine Learning Stock Price Predictor',
  'Advanced machine learning project that predicts stock prices using LSTM neural networks. Includes data preprocessing, feature engineering, model training, and a web interface for predictions. Great for understanding time series forecasting and deep learning concepts.',
  'ML project for stock price prediction using LSTM and Python',
  3499.00,
  'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '["Python", "TensorFlow", "Pandas", "NumPy", "Flask"]'::jsonb,
  '["LSTM Neural Network Implementation", "Real-time Stock Data Integration", "Data Preprocessing Pipeline", "Interactive Web Dashboard", "Model Performance Metrics", "Prediction Visualization", "Historical Data Analysis"]'::jsonb,
  false
),
(
  'React Native Food Delivery App',
  'Complete mobile application for food delivery built with React Native. Features include user registration, restaurant browsing, menu selection, cart management, real-time order tracking, and payment integration. Includes both customer and restaurant owner interfaces.',
  'Cross-platform food delivery app with React Native',
  4999.00,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '["React Native", "Firebase", "Node.js", "MongoDB", "Stripe"]'::jsonb,
  '["Cross-platform Mobile App", "User & Restaurant Registration", "Real-time Order Tracking", "Payment Gateway Integration", "Push Notifications", "GPS Location Services", "Rating & Review System", "Admin Panel for Management"]'::jsonb,
  true
);