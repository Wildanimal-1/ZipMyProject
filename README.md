# ZipMyProject - Student Project Selling Platform

A modern, full-stack web application for selling student projects with secure payments and admin management.

## 🚀 Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Project Catalog**: Browse and search projects with detailed information
- **Secure Payments**: Integrated Razorpay and Stripe payment gateways
- **Admin Panel**: Complete project management for administrators
- **Real-time Updates**: Live project updates and user interactions
- **Responsive Design**: Mobile-friendly interface
- **PostgreSQL Database**: Robust, scalable database solution

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **Razorpay & Stripe** for payments

## 📦 Project Structure

```
ZipMyProject/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── pages/             # Page components
│   └── types/             # TypeScript type definitions
├── backend/               # Backend API server
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   ├── config/            # Database configuration
│   └── scripts/           # Database migration scripts
├── database/              # Database schema and migrations
└── deployment/            # Deployment guides and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ installed
- Git installed

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd ZipMyProject
```

### 2. Setup Frontend
```bash
# Install frontend dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Setup Backend
```bash
# Navigate to backend
cd backend

# Install backend dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database and API keys
nano .env
```

### 4. Setup Database
```bash
# Create PostgreSQL database
sudo -u postgres psql
CREATE DATABASE ZipMyProject;
CREATE USER ZipMyProject_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ZipMyProject TO ZipMyProject_user;
\q

# Run database migration
cd backend
npm run migrate
```

### 5. Start Development Servers
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from root directory)
npm run dev
```

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Backend (backend/.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/ZipMyProject
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 📚 API Documentation

Complete API documentation is available in [API_ENDPOINTS.md](./API_ENDPOINTS.md)

### Key Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/projects` - Get all projects
- `POST /api/orders/create` - Create payment order
- `POST /api/orders/verify` - Verify payment

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- All protected routes require `Authorization: Bearer <token>` header
- Admin routes require additional admin privileges

## 💳 Payment Integration

### Razorpay Setup
1. Create account at [Razorpay](https://razorpay.com/)
2. Get API keys from dashboard
3. Add keys to environment variables

### Stripe Setup
1. Create account at [Stripe](https://stripe.com/)
2. Get API keys from dashboard
3. Add keys to environment variables

## 🚀 Deployment

### Option 1: DigitalOcean (Recommended)
- Cost: ~$7/month
- Complete control over server
- See [deployment/README.md](./deployment/README.md) for detailed guide

### Option 2: Render.com
- Cost: ~$14/month
- Easier setup, managed hosting
- Automatic deployments from Git

### Option 3: Railway
- Cost: Variable pricing
- Simple deployment process
- Built-in PostgreSQL

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting on API endpoints
- CORS protection
- SQL injection prevention
- XSS protection with Helmet.js

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `projects` - Project information and metadata
- `orders` - Purchase transactions
- `user_downloads` - Download tracking
- `contact_messages` - Contact form submissions

## 🛠️ Development

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test locally
3. Update documentation if needed
4. Submit pull request

### Database Migrations
```bash
# Create new migration
cd backend
npm run migrate
```

### Testing
```bash
# Run frontend tests
npm test

# Run backend tests
cd backend
npm test
```

## 📞 Support

For deployment help or technical issues:
1. Check the deployment guide in `deployment/README.md`
2. Review API documentation in `API_ENDPOINTS.md`
3. Check database logs and server status
4. Verify environment variables are set correctly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**ZipMyProject** - Empowering students with quality projects for academic success.