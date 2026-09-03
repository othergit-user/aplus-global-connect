// services/communication/EmailService.ts
import { FirestoreService } from '../firebase/FirestoreService';
import { Client } from '../../models/Client';
import { functions } from '../../config/firebase';
import { httpsCallable } from 'firebase/functions';

export class EmailService {
  private clientService: FirestoreService<Client>;

  constructor() {
    this.clientService = new FirestoreService<Client>('clients');
  }

  async sendEmail(to: string, subject: string, body: string, attachments?: any[]) {
    try {
      const sendEmailFunction = httpsCallable(functions, 'sendEmail');
      const result = await sendEmailFunction({
        to,
        subject,
        body,
        attachments
      });
      
      return result.data;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendBulkEmails(clientIds: string[], subject: string, body: string) {
    const emails = [];
    const failed = [];

    for (const clientId of clientIds) {
      try {
        const client = await this.clientService.getById(clientId);
        if (client && client.email.length > 0) {
          await this.sendEmail(client.email[0], subject, body);
          emails.push(clientId);
        }
      } catch (error) {
        failed.push({ clientId, error });
      }
    }

    return { sent: emails, failed };
  }

  async sendCampaignUpdate(campaignId: string, update: string) {
    // Send updates to campaign stakeholders
    // Implement logic to get campaign stakeholders
  }

  async sendTemplatedEmail(template: string, data: any, recipient: string) {
    const sendTemplateEmail = httpsCallable(functions, 'sendTemplatedEmail');
    const result = await sendTemplateEmail({
      template,
      data,
      recipient
    });
    
    return result.data;
  }
}

// services/communication/SMSService.ts
import { functions } from '../../config/firebase';
import { httpsCallable } from 'firebase/functions';

export class SMSService {
  async sendSMS(to: string, message: string) {
    try {
      const sendSMSFunction = httpsCallable(functions, 'sendSMS');
      const result = await sendSMSFunction({
        to,
        message
      });
      
      return result.data;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  }

  async sendBulkSMS(phoneNumbers: string[], message: string) {
    const results = [];
    
    for (const phone of phoneNumbers) {
      try {
        await this.sendSMS(phone, message);
        results.push({ phone, success: true });
      } catch (error) {
        results.push({ phone, success: false, error });
      }
    }
    
    return results;
  }

  async sendScheduledSMS(schedule: Date, to: string, message: string) {
    const scheduleSMS = httpsCallable(functions, 'scheduleSMS');
    const result = await scheduleSMS({
      to,
      message,
      scheduleTime: schedule.toISOString()
    });
    
    return result.data;
  }
}