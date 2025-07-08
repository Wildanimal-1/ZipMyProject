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
  thumbnail: string;
  screenshots: string[];
  downloadLink: string;
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

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}