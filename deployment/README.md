# ZipMyProject Deployment Guide

## Complete PostgreSQL Backend Setup & Deployment

### 🚀 Quick Start (Local Development)

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Windows
   # Download from: https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE ZipMyProject;
   CREATE USER ZipMyProject_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE ZipMyProject TO ZipMyProject_user;
   \q
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run migrate
   npm run dev
   ```

### 🌐 Production Deployment Options

## Option 1: DigitalOcean (Recommended)

### Step 1: Create DigitalOcean Droplet
1. Go to [DigitalOcean](https://www.digitalocean.com/)
2. Create account and add payment method
3. Create new Droplet:
   - **Image**: Ubuntu 22.04 LTS
   - **Size**: Basic $6/month (1GB RAM, 1 vCPU)
   - **Region**: Choose closest to your users
   - **Authentication**: SSH Key (recommended)

### Step 2: Setup Server
```bash
# Connect to your droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL
apt install postgresql postgresql-contrib -y

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx (Web Server)
apt install nginx -y

# Install Certbot (SSL Certificates)
apt install certbot python3-certbot-nginx -y
```

### Step 3: Setup PostgreSQL
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE ZipMyProject;
CREATE USER ZipMyProject_user WITH PASSWORD 'your_very_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE ZipMyProject TO ZipMyProject_user;
\q

# Configure PostgreSQL for remote connections (if needed)
sudo nano /etc/postgresql/14/main/postgresql.conf
# Change: listen_addresses = 'localhost' to listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

### Step 4: Deploy Backend
```bash
# Create app directory
mkdir /var/www/ZipMyProject
cd /var/www/ZipMyProject

# Clone your code (or upload via SCP)
# Upload your backend folder here

# Install dependencies
cd backend
npm install --production

# Setup environment
cp .env.example .env
nano .env
# Configure all environment variables

# Run database migration
npm run migrate

# Start with PM2
pm2 start server.js --name "ZipMyProject-api"
pm2 startup
pm2 save
```

### Step 5: Setup Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ZipMyProject

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # API routes
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend (React build)
    location / {
        root /var/www/ZipMyProject/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/ZipMyProject /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Step 6: Deploy Frontend
```bash
# Build React app locally
npm run build

# Upload dist folder to server
scp -r dist/ root@your_droplet_ip:/var/www/ZipMyProject/frontend/

# Or build on server
cd /var/www/ZipMyProject/frontend
npm install
npm run build
```

## Option 2: Render.com (Easier but Limited)

### Backend Deployment on Render
1. Go to [Render.com](https://render.com/)
2. Connect your GitHub repository
3. Create new Web Service:
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: Add all from .env

### Database on Render
1. Create PostgreSQL database on Render
2. Copy connection string to your backend environment variables

### Frontend Deployment
1. Create Static Site on Render:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

## Option 3: Railway (Alternative)

1. Go to [Railway.app](https://railway.app/)
2. Connect GitHub repository
3. Deploy PostgreSQL database
4. Deploy backend service
5. Deploy frontend as static site

### 🔒 Security Checklist

- [ ] Use strong passwords for database
- [ ] Enable firewall (ufw enable)
- [ ] Setup SSL certificates
- [ ] Configure environment variables securely
- [ ] Enable PostgreSQL authentication
- [ ] Setup regular backups
- [ ] Monitor server resources

### 📊 Database Backup Script

```bash
#!/bin/bash
# Create backup script
sudo nano /usr/local/bin/backup-ZipMyProject.sh

# Add this content:
#!/bin/bash
BACKUP_DIR="/var/backups/ZipMyProject"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U ZipMyProject_user -h localhost ZipMyProject > $BACKUP_DIR/ZipMyProject_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

# Make executable
sudo chmod +x /usr/local/bin/backup-ZipMyProject.sh

# Add to crontab for daily backups
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-ZipMyProject.sh
```

### 🌍 Domain Setup

1. **Buy Domain**: Use Namecheap, GoDaddy, or Cloudflare
2. **DNS Configuration**:
   ```
   A Record: @ -> Your_Server_IP
   A Record: www -> Your_Server_IP
   ```
3. **SSL Setup**: Automatically handled by Certbot

### 📈 Monitoring & Maintenance

```bash
# Check API status
curl https://your-domain.com/api/health

# Monitor PM2 processes
pm2 status
pm2 logs

# Check database connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Monitor server resources
htop
df -h
```

### 💰 Cost Estimation

**DigitalOcean Setup:**
- Droplet: $6/month
- Domain: $10-15/year
- Total: ~$7-8/month

**Render Setup:**
- Database: $7/month
- Backend: $7/month
- Frontend: Free
- Total: ~$14/month

### 🆘 Troubleshooting

**Common Issues:**

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Check logs
   sudo tail -f /var/log/postgresql/postgresql-14-main.log
   ```

2. **API Not Responding**
   ```bash
   # Check PM2 status
   pm2 status
   pm2 logs ZipMyProject-api
   
   # Restart if needed
   pm2 restart ZipMyProject-api
   ```

3. **Frontend Not Loading**
   ```bash
   # Check Nginx status
   sudo systemctl status nginx
   
   # Check configuration
   sudo nginx -t
   ```

### 📞 Support

If you need help with deployment:
1. Check the logs first
2. Verify all environment variables
3. Test database connection
4. Check firewall settings

This guide provides everything you need to deploy ZipMyProject with PostgreSQL successfully!