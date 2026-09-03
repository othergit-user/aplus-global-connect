// services/payment/PaymentService.ts
import { functions } from '../../config/firebase';
import { httpsCallable } from 'firebase/functions';

export class PaymentService {
  private stripe: any;
  private paypal: any;

  constructor() {
    this.initializeStripe();
    this.initializePayPal();
  }

  private async initializeStripe() {
    // Initialize Stripe
    const { Stripe } = require('stripe');
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  private async initializePayPal() {
    // Initialize PayPal
    const { PayPal } = require('@paypal/checkout-server-sdk');
    this.paypal = new PayPal({
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET
    });
  }

  async createPaymentIntent(amount: number, currency: string, customerId?: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: currency || 'usd',
        customer: customerId,
        metadata: {
          platform: 'AplusGlobalConnect'
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  async createPayPalOrder(amount: number, currency: string) {
    try {
      const createOrder = httpsCallable(functions, 'createPayPalOrder');
      const result = await createOrder({
        amount,
        currency: currency || 'USD'
      });
      
      return result.data;
    } catch (error) {
      console.error('Failed to create PayPal order:', error);
      throw error;
    }
  }

  async capturePayPalOrder(orderId: string) {
    try {
      const captureOrder = httpsCallable(functions, 'capturePayPalOrder');
      const result = await captureOrder({ orderId });
      return result.data;
    } catch (error) {
      console.error('Failed to capture PayPal order:', error);
      throw error;
    }
  }

  async createSubscription(priceId: string, customerId: string) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });

      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      };
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  async processTicketPayment(amount: number, ticketData: any) {
    // Process payment for tickets
    // Can use Stripe Checkout or PayPal
    const createTicketPayment = httpsCallable(functions, 'createTicketPayment');
    const result = await createTicketPayment({
      amount,
      ticketData
    });
    
    return result.data;
  }

  async getPaymentHistory(customerId: string) {
    try {
      const paymentIntents = await this.stripe.paymentIntents.list({
        customer: customerId,
        limit: 100
      });

      return paymentIntents.data.map(intent => ({
        id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
        status: intent.status,
        created: new Date(intent.created * 1000),
        description: intent.description
      }));
    } catch (error) {
      console.error('Failed to get payment history:', error);
      throw error;
    }
  }
}