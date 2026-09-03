// services/crm/CRMService.ts
import { FirestoreService } from '../firebase/FirestoreService';
import { Client, Communication } from '../../models/Client';
import { CampaignService } from '../campaigns/CampaignService';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export class CRMService {
  private clientService: FirestoreService<Client>;
  private campaignService: CampaignService;

  constructor() {
    this.clientService = new FirestoreService<Client>('clients');
    this.campaignService = new CampaignService();
  }

  async createClient(data: Partial<Client>): Promise<string> {
    const clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
      companyName: data.companyName || 'New Client',
      contactPerson: data.contactPerson || '',
      email: data.email || [],
      phone: data.phone || [],
      address: data.address || { street: '', city: '', state: '', zip: '', country: '' },
      industry: data.industry || '',
      status: data.status || 'lead',
      notes: data.notes || '',
      socialMediaAccounts: data.socialMediaAccounts || [],
      campaigns: data.campaigns || [],
      communicationLog: data.communicationLog || [],
      createdBy: data.createdBy || ''
    };

    return await this.clientService.create(clientData);
  }

  async getClientWithCampaigns(clientId: string): Promise<any> {
    const client = await this.clientService.getById(clientId);
    if (!client) return null;

    const campaigns = await this.campaignService.getCampaignsByClient(clientId);
    
    return {
      ...client,
      campaigns
    };
  }

  async addCommunication(clientId: string, communication: Communication): Promise<void> {
    const client = await this.clientService.getById(clientId);
    if (!client) return;

    const updatedLog = [...(client.communicationLog || []), communication];
    await this.clientService.update(clientId, {
      communicationLog: updatedLog,
      updatedAt: new Date()
    });
  }

  async searchClients(searchTerm: string): Promise<Client[]> {
    // Implement search using Firebase queries
    // This is a simplified version - you might want to use Algolia or similar
    const q = query(
      collection(db, 'clients'),
      orderBy('companyName')
    );
    
    const querySnapshot = await getDocs(q);
    const clients = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Client[];
    
    // Filter by search term
    return clients.filter(client => 
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.some(email => email.includes(searchTerm))
    );
  }

  async getClientStats(clientId: string): Promise<any> {
    const client = await this.clientService.getById(clientId);
    if (!client) return null;

    const campaigns = await this.campaignService.getCampaignsByClient(clientId);
    
    const totalSpent = campaigns.reduce((sum, camp) => sum + (camp.spent || 0), 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalReach = campaigns.reduce((sum, camp) => sum + (camp.metrics?.reach || 0), 0);

    return {
      totalCampaigns: campaigns.length,
      totalSpent,
      activeCampaigns,
      totalReach,
      averageROI: totalSpent > 0 ? (campaigns.reduce((sum, c) => sum + (c.metrics?.roas || 0), 0) / campaigns.length) : 0
    };
  }
}