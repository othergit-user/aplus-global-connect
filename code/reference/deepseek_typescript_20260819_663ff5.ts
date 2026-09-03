// services/ai/AIAgentService.ts
import { FirestoreService } from '../firebase/FirestoreService';
import { Campaign } from '../../models/Campaign';
import OpenAI from 'openai';
import { functions } from '../../config/firebase';
import { httpsCallable } from 'firebase/functions';

export class AIAgentService {
  private campaignService: FirestoreService<Campaign>;
  private selectedModel: string = 'gpt-4';
  private openai: OpenAI | null = null;

  constructor() {
    this.campaignService = new FirestoreService<Campaign>('campaigns');
    this.initializeAI();
  }

  async initializeAI() {
    // Initialize with Firebase Functions or directly with API keys
    try {
      // Option 1: Use Firebase Functions as proxy
      const getOpenAIClient = httpsCallable(functions, 'getOpenAIClient');
      const result = await getOpenAIClient();
      
      // Option 2: Direct initialization with environment variables
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Only for development
      });
    } catch (error) {
      console.error('Failed to initialize AI:', error);
    }
  }

  async switchModel(model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-2' | 'claude-instant' | 'gemini-pro') {
    this.selectedModel = model;
    // Reinitialize with new model
    await this.initializeAI();
  }

  async analyzeCampaign(campaignId: string): Promise<any> {
    const campaign = await this.campaignService.getById(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const prompt = `
      Analyze this marketing campaign and provide insights:
      Campaign Name: ${campaign.name}
      Platforms: ${campaign.platforms.map(p => p.platform).join(', ')}
      Budget: $${campaign.budget}
      Target Audience: ${JSON.stringify(campaign.targetAudience)}
      Content: ${campaign.content.map(c => c.text).join('\n')}
      
      Provide:
      1. Campaign effectiveness prediction
      2. Suggested improvements
      3. Best posting times
      4. Content recommendations
      5. ROI prediction
    `;

    try {
      const response = await this.openai?.chat.completions.create({
        model: this.selectedModel,
        messages: [
          { role: 'system', content: 'You are a digital marketing expert AI.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const analysis = response?.choices[0]?.message?.content;
      
      // Store analysis in campaign
      await this.campaignService.update(campaignId, {
        'aiAnalysis': {
          analysis,
          generatedAt: new Date().toISOString(),
          model: this.selectedModel
        }
      });

      return {
        analysis,
        modelUsed: this.selectedModel
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw error;
    }
  }

  async generateCampaignIdeas(clientInfo: any): Promise<string[]> {
    const prompt = `
      Generate 5 creative digital marketing campaign ideas for:
      Company: ${clientInfo.companyName}
      Industry: ${clientInfo.industry}
      Target Audience: ${clientInfo.targetAudience}
      Budget Range: $${clientInfo.budget}
      
      Provide ideas that are:
      1. Platform-specific (Facebook, Instagram, TikTok, Twitter, WhatsApp)
      2. Cost-effective
      3. Engaging
      4. Trackable
    `;

    try {
      const response = await this.openai?.chat.completions.create({
        model: this.selectedModel,
        messages: [
          { role: 'system', content: 'You are a creative marketing strategist.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 800
      });

      const ideas = response?.choices[0]?.message?.content?.split('\n').filter(line => line.trim());
      return ideas || [];
    } catch (error) {
      console.error('Failed to generate campaign ideas:', error);
      return [];
    }
  }

  async optimizePostContent(content: string, platform: string): Promise<string> {
    const prompt = `
      Optimize this ${platform} post for maximum engagement:
      Original: ${content}
      
      Optimization guidelines:
      1. Perfect length for ${platform}
      2. Use relevant hashtags
      3. Include call-to-action
      4. Make it engaging
      5. Add emojis where appropriate
    `;

    try {
      const response = await this.openai?.chat.completions.create({
        model: this.selectedModel,
        messages: [
          { role: 'system', content: 'You are a social media optimization expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return response?.choices[0]?.message?.content || content;
    } catch (error) {
      console.error('Failed to optimize content:', error);
      return content;
    }
  }

  async predictCampaignSuccess(campaignData: any): Promise<any> {
    // AI-powered campaign success prediction
    // Based on historical data and current trends
    
    const prompt = `
      Predict the success of this campaign:
      ${JSON.stringify(campaignData, null, 2)}
      
      Provide:
      1. Estimated reach (low, medium, high)
      2. Expected engagement rate (%)
      3. Estimated ROI
      4. Risk factors
      5. Success probability score (0-100)
    `;

    try {
      const response = await this.openai?.chat.completions.create({
        model: this.selectedModel,
        messages: [
          { role: 'system', content: 'You are a marketing analytics expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 500
      });

      return JSON.parse(response?.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Prediction failed:', error);
      return null;
    }
  }

  async generateContentIdeas(topic: string, platform: string): Promise<any> {
    const prompt = `
      Generate content ideas for ${platform} about ${topic}.
      Include:
      1. 10 content ideas
      2. Best posting times
      3. Suggested hashtags
      4. Content formats (video, image, carousel, text)
    `;

    try {
      const response = await this.openai?.chat.completions.create({
        model: this.selectedModel,
        messages: [
          { role: 'system', content: 'You are a content strategy expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 600
      });

      return response?.choices[0]?.message?.content;
    } catch (error) {
      console.error('Failed to generate content ideas:', error);
      return null;
    }
  }
}