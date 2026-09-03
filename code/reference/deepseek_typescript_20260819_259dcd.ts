// services/campaigns/CampaignService.ts
import { FirestoreService } from '../firebase/FirestoreService';
import { Campaign, CampaignPlatform } from '../../models/Campaign';
import { SocialMediaService } from '../social/SocialMediaService';
import { AIAgentService } from '../ai/AIAgentService';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export class CampaignService {
  private campaignService: FirestoreService<Campaign>;
  private socialMediaService: SocialMediaService;
  private aiService: AIAgentService;

  constructor() {
    this.campaignService = new FirestoreService<Campaign>('campaigns');
    this.socialMediaService = new SocialMediaService();
    this.aiService = new AIAgentService();
  }

  async createCampaign(data: Partial<Campaign>): Promise<string> {
    const campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> = {
      name: data.name || 'Untitled Campaign',
      clientId: data.clientId || '',
      clientName: data.clientName || '',
      description: data.description || '',
      platforms: data.platforms || [],
      status: 'draft',
      startDate: data.startDate || new Date(),
      budget: data.budget || 0,
      spent: 0,
      currency: data.currency || 'USD',
      targetAudience: data.targetAudience || { demographics: [], interests: [] },
      content: data.content || [],
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        engagement: 0,
        reach: 0,
        ctr: 0,
        cpc: 0,
        roas: 0,
        dailyStats: []
      },
      schedule: data.schedule || { autoPost: false, posts: [] },
      createdBy: data.createdBy || '',
      tags: data.tags || []
    };

    const campaignId = await this.campaignService.create(campaignData);
    
    // Trigger AI analysis for new campaign
    await this.aiService.analyzeCampaign(campaignId);
    
    return campaignId;
  }

  async launchCampaign(campaignId: string): Promise<void> {
    const campaign = await this.campaignService.getById(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    // Publish content to all enabled platforms
    await this.socialMediaService.publishToPlatforms(campaignId);

    // Update campaign status
    await this.campaignService.update(campaignId, {
      status: 'active',
      startDate: new Date()
    });

    // Log campaign launch in analytics
    // Start tracking metrics
  }

  async getCampaignMetrics(campaignId: string): Promise<any> {
    const campaign = await this.campaignService.getById(campaignId);
    if (!campaign) return null;

    // Fetch metrics from each platform
    const platformMetrics = await Promise.all(
      campaign.platforms.map(platform => 
        this.socialMediaService.getPlatformMetrics(platform)
      )
    );

    // Aggregate metrics
    return {
      ...campaign.metrics,
      platformBreakdown: platformMetrics
    };
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    const q = query(
      collection(db, 'campaigns'),
      where('status', 'in', ['active', 'scheduled']),
      orderBy('startDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Campaign[];
  }

  async getCampaignsByClient(clientId: string): Promise<Campaign[]> {
    const q = query(
      collection(db, 'campaigns'),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Campaign[];
  }

  async pauseCampaign(campaignId: string): Promise<void> {
    await this.campaignService.update(campaignId, {
      status: 'paused',
      'schedule.autoPost': false
    });
  }

  async resumeCampaign(campaignId: string): Promise<void> {
    await this.campaignService.update(campaignId, {
      status: 'active',
      'schedule.autoPost': true
    });
  }

  async archiveCampaign(campaignId: string): Promise<void> {
    await this.campaignService.update(campaignId, {
      status: 'archived'
    });
  }

  async duplicateCampaign(campaignId: string): Promise<string> {
    const campaign = await this.campaignService.getById(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const duplicateData = {
      ...campaign,
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      startDate: new Date(),
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        engagement: 0,
        reach: 0,
        ctr: 0,
        cpc: 0,
        roas: 0,
        dailyStats: []
      },
      createdAt: undefined,
      updatedAt: undefined
    };

    delete duplicateData.id;
    return await this.campaignService.create(duplicateData);
  }
}