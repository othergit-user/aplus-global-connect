export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export interface Campaign {
  id: string;
  name: string;
  clientName: string;
  status: CampaignStatus;
  platforms: string[];
  budget: number;
  currency: string;
  reach: number;
}