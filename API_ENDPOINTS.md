# ProjectNest API Endpoints Documentation

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

### GET /api/auth/me
Get current user information (requires authentication).

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

---

## 📦 Project Endpoints

### GET /api/projects
Get all active projects (public access).

**Query Parameters:**
- `limit` (optional): Number of projects to return
- `offset` (optional): Number of projects to skip

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "E-Commerce Website",
    "description": "A full-stack e-commerce website...",
    "shortDescription": "Full-stack e-commerce website with React and Node.js",
    "price": 2999.00,
    "thumbnail": "https://example.com/image.jpg",
    "screenshots": ["https://example.com/screenshot1.jpg"],
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### GET /api/projects/:id
Get single project by ID (public access).

**Response (200):**
```json
{
  "id": 1,
  "title": "E-Commerce Website",
  "description": "A full-stack e-commerce website...",
  "shortDescription": "Full-stack e-commerce website with React and Node.js",
  "price": 2999.00,
  "thumbnail": "https://example.com/image.jpg",
  "screenshots": ["https://example.com/screenshot1.jpg"],
  "downloadLink": "https://example.com/download/project1.zip",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### POST /api/projects
Create new project (admin only).

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Detailed description of the project...",
  "shortDescription": "Brief description",
  "price": 1999.00,
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "screenshots": ["https://example.com/screenshot1.jpg"],
  "downloadLink": "https://example.com/download/project.zip"
}
```

**Response (201):**
```json
{
  "id": 2,
  "title": "New Project",
  "description": "Detailed description of the project...",
  "shortDescription": "Brief description",
  "price": 1999.00,
  "thumbnail": "https://example.com/thumbnail.jpg",
  "screenshots": ["https://example.com/screenshot1.jpg"],
  "downloadLink": "https://example.com/download/project.zip",
  "createdAt": "2024-01-16T10:00:00Z"
}
```

### PUT /api/projects/:id
Update existing project (admin only).

**Request Body:** Same as POST /api/projects

**Response (200):** Updated project object

### DELETE /api/projects/:id
Delete project (admin only). This marks the project as inactive.

**Response (200):**
```json
{
  "message": "Project deleted successfully"
}
```

---

## 💳 Order & Payment Endpoints

### POST /api/orders/create
Create payment order for a project.

**Request Body:**
```json
{
  "projectId": 1,
  "paymentMethod": "razorpay" // or "stripe"
}
```

**Response (200):**
```json
{
  "project": {
    "id": 1,
    "title": "E-Commerce Website",
    "price": 2999.00
  },
  "payment": {
    "orderId": "order_razorpay_id",
    "amount": 2999.00,
    "currency": "INR",
    "keyId": "rzp_test_key"
  }
}
```

### POST /api/orders/verify
Verify payment and complete purchase.

**Request Body:**
```json
{
  "paymentId": "pay_razorpay_payment_id",
  "orderId": "order_razorpay_order_id",
  "signature": "razorpay_signature",
  "projectId": 1,
  "paymentMethod": "razorpay"
}
```

**Response (200):**
```json
{
  "message": "Payment successful",
  "downloadLink": "https://example.com/download/project1.zip",
  "orderId": 123
}
```

### GET /api/orders/my-purchases
Get user's purchased projects (requires authentication).

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "E-Commerce Website",
    "thumbnail": "https://example.com/thumbnail.jpg",
    "downloadLink": "https://example.com/download/project1.zip",
    "purchaseDate": "2024-01-15T10:00:00Z",
    "amount": 2999.00,
    "downloadCount": 3,
    "lastDownloaded": "2024-01-16T15:30:00Z"
  }
]
```

### GET /api/orders/download/:projectId
Download purchased project (requires authentication).

**Response (200):**
```json
{
  "downloadLink": "https://example.com/download/project1.zip",
  "projectTitle": "E-Commerce Website"
}
```

### GET /api/orders/admin/all
Get all orders (admin only).

**Response (200):**
```json
[
  {
    "id": 1,
    "amount": 2999.00,
    "paymentStatus": "completed",
    "paymentMethod": "razorpay",
    "createdAt": "2024-01-15T10:00:00Z",
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "project": {
      "title": "E-Commerce Website"
    }
  }
]
```

---

## 📧 Contact Endpoints

### POST /api/contact
Submit contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about project",
  "message": "I have a question about the e-commerce project..."
}
```

**Response (200):**
```json
{
  "message": "Message sent successfully"
}
```

### GET /api/contact/admin/all
Get all contact messages (admin only).

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question about project",
    "message": "I have a question about the e-commerce project...",
    "is_read": false,
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

### PUT /api/contact/:id/read
Mark contact message as read (admin only).

**Response (200):**
```json
{
  "message": "Message marked as read"
}
```

---

## 🏥 Health Check

### GET /api/health
Check API server status.

**Response (200):**
```json
{
  "status": "OK",
  "message": "ProjectNest API is running",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## ❌ Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 🔧 Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Response when exceeded**:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Prices are in Indian Rupees (INR)
3. File uploads are handled separately (not documented here)
4. All endpoints return JSON responses
5. CORS is enabled for the configured frontend URL

---

## 🧪 Testing Examples

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Get Projects:**
```bash
curl http://localhost:5000/api/projects
```

**Create Project (Admin):**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Project","description":"Test description","shortDescription":"Test","price":999,"thumbnailUrl":"https://example.com/thumb.jpg","screenshots":[],"downloadLink":"#"}'
```

This documentation covers all the API endpoints you'll need to integrate with your PostgreSQL backend!