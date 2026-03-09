export interface User {
  id: number;
  email: string;
  companyName: string;
  role: 'ADMIN' | 'COMPANY';
  validated: boolean;
  suspended: boolean;
  reliabilityScore: number;
  subscriptionPlanName: 'FREE' | 'MEDIUM' | 'EXTRA';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
