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
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}