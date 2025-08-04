export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  category: 'web-dev' | 'mobile-app' | 'machine-learning' | 'data-science' | 'other';
  techStack: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
  demoUrl?: string;
  thumbnail: string;
  screenshots: string[];
  downloadLink: string;
  isPopular: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentId: string;
  createdAt: string;
}

export interface CartItem {
  project: Project;
  quantity: number;
}

export interface Review {
  id: string;
  userId: string;
  projectId: string;
  userName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isResolved: boolean;
  adminReply?: string;
  repliedAt?: string;
  repliedBy?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'editor' | 'support';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

export interface OrderDetails {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId: string;
  paymentMethod: 'razorpay' | 'stripe';
  userInfo: {
    name: string;
    email: string;
  };
  projectInfo: {
    title: string;
    thumbnail: string;
  };
  createdAt: string;
}

export interface Analytics {
  totalUsers: number;
  totalProjects: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  bestSellingProjects: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: OrderDetails[];
}

export interface SiteSettings {
  siteName: string;
  logo: string;
  contactEmail: string;
  supportPhone: string;
  razorpayKeyId: string;
  stripePublishableKey: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'review' | 'contact' | 'user';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}