// models/Campaign.ts
export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  description: string;
  platforms: CampaignPlatform[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  startDate: Date;
  endDate?: Date;
  budget: number;
  spent: number;
  currency: string;
  targetAudience: TargetAudience;
  content: CampaignContent[];
  metrics: CampaignMetrics;
  schedule: CampaignSchedule;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
}

export interface CampaignPlatform {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'whatsapp';
  enabled: boolean;
  accountId: string;
  settings: Record<string, any>;
  publishSchedule: PublishSchedule[];
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  engagement: number;
  reach: number;
  ctr: number;
  cpc: number;
  roas: number;
  dailyStats: DailyStat[];
}

// models/Client.ts
export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string[];
  phone: string[];
  address: Address;
  industry: string;
  status: 'active' | 'inactive' | 'lead' | 'negotiating';
  notes: string;
  socialMediaAccounts: SocialMediaAccount[];
  campaigns: string[]; // References to campaign IDs
  communicationLog: Communication[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// models/User.ts
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'admin' | 'manager' | 'user' | 'client';
  permissions: string[];
  preferences: UserPreferences;
  companyId: string;
  teams: string[];
  createdAt: Date;
  lastLogin: Date;
}

export interface UserPreferences {
  defaultPlatforms: string[];
  notificationSettings: NotificationSettings;
  dashboardLayout: DashboardLayout;
  aiModelPreference: 'gpt4' | 'claude' | 'gemini';
}