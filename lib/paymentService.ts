export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  customerData: {
    name?: string;
    email?: string;
    phone?: string;
  };
  cardData?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
  mobileData?: {
    phoneNumber: string;
    pin?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  data?: any;
}

class PaymentService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  async processCardPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulation d'un appel API pour carte bancaire
      await this.delay(2000);
      
      // Validation des données de carte
      if (!this.validateCardData(paymentData.cardData!)) {
        throw new Error('Données de carte invalides');
      }

      // Simulation d'une réponse de succès
      return {
        success: true,
        transactionId: `CARD_${Date.now()}`,
        status: 'completed',
        message: 'Paiement par carte réussi',
        data: {
          last4: paymentData.cardData!.number.slice(-4),
          brand: this.getCardBrand(paymentData.cardData!.number)
        }
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Erreur de paiement'
      };
    }
  }

  async processPayPalPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Redirection vers PayPal (simulation)
      await this.delay(1500);
      
      return {
        success: true,
        transactionId: `PP_${Date.now()}`,
        status: 'completed',
        message: 'Paiement PayPal réussi'
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        message: 'Erreur PayPal'
      };
    }
  }

  async processOrangeMoneyPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulation d'un appel à l'API Orange Money
      await this.delay(3000);
      
      if (!this.validateOrangeMoneyPhone(paymentData.mobileData!.phoneNumber)) {
        throw new Error('Numéro Orange Money invalide');
      }

      // Simulation d'envoi SMS et confirmation
      return {
        success: true,
        transactionId: `OM_${Date.now()}`,
        status: 'completed',
        message: 'Paiement Orange Money réussi',
        data: {
          phoneNumber: paymentData.mobileData!.phoneNumber,
          fee: 50 // Frais Orange Money
        }
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Erreur Orange Money'
      };
    }
  }

  async processMTNMoneyPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulation d'un appel à l'API MTN Money
      await this.delay(3000);
      
      if (!this.validateMTNMoneyPhone(paymentData.mobileData!.phoneNumber)) {
        throw new Error('Numéro MTN Money invalide');
      }

      return {
        success: true,
        transactionId: `MTN_${Date.now()}`,
        status: 'completed',
        message: 'Paiement MTN Money réussi',
        data: {
          phoneNumber: paymentData.mobileData!.phoneNumber,
          fee: 50 // Frais MTN Money
        }
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Erreur MTN Money'
      };
    }
  }

  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    switch (paymentData.paymentMethod) {
      case 'card':
        return this.processCardPayment(paymentData);
      case 'paypal':
        return this.processPayPalPayment(paymentData);
      case 'orange_money':
        return this.processOrangeMoneyPayment(paymentData);
      case 'mtn_money':
        return this.processMTNMoneyPayment(paymentData);
      default:
        return {
          success: false,
          transactionId: '',
          status: 'failed',
          message: 'Méthode de paiement non supportée'
        };
    }
  }

  // Méthodes de validation
  private validateCardData(cardData: any): boolean {
    const { number, expiry, cvv, name } = cardData;
    const cleanNumber = number.replace(/\s/g, '');
    
    // Validation numéro de carte (Luhn algorithm simplifié)
    if (cleanNumber.length < 16 || cleanNumber.length > 19) return false;
    
    // Validation date d'expiration
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    
    // Validation CVV
    if (!/^\d{3,4}$/.test(cvv)) return false;
    
    // Validation nom
    if (name.length < 2) return false;
    
    return true;
  }

  private validateOrangeMoneyPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    // Numéros Orange Cameroun: +237 6XX XX XX XX
    return cleanPhone.startsWith('237') && cleanPhone.length === 12 && cleanPhone.charAt(3) === '6';
  }

  private validateMTNMoneyPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    // Numéros MTN Cameroun: +237 6XX XX XX XX ou 67X XX XX XX
    return cleanPhone.startsWith('237') && cleanPhone.length === 12 && 
           (cleanPhone.charAt(3) === '6' || cleanPhone.charAt(3) === '2');
  }

  private getCardBrand(number: string): string {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'Mastercard';
    if (cleanNumber.startsWith('3')) return 'American Express';
    
    return 'Unknown';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Méthodes utilitaires pour l'intégration
  async verifyTransaction(transactionId: string): Promise<PaymentResponse> {
    try {
      // Simulation de vérification de transaction
      await this.delay(1000);
      
      return {
        success: true,
        transactionId,
        status: 'completed',
        message: 'Transaction vérifiée'
      };
    } catch (error) {
      return {
        success: false,
        transactionId,
        status: 'failed',
        message: 'Impossible de vérifier la transaction'
      };
    }
  }

  async refundPayment(transactionId: string, amount: number): Promise<PaymentResponse> {
    try {
      // Simulation de remboursement
      await this.delay(2000);
      
      return {
        success: true,
        transactionId: `REF_${Date.now()}`,
        status: 'completed',
        message: 'Remboursement effectué'
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        message: 'Erreur lors du remboursement'
      };
    }
  }

  // Configuration des frais par méthode
  getPaymentFees(method: string, amount: number): number {
    const fees = {
      'card': 0,
      'paypal': 0,
      'orange_money': 50,
      'mtn_money': 50
    };
    
    return fees[method as keyof typeof fees] || 0;
  }

  // Limites de paiement
  getPaymentLimits(method: string): { min: number; max: number } {
    const limits = {
      'card': { min: 1000, max: 5000000 }, // 1k à 5M FCFA
      'paypal': { min: 1000, max: 3000000 },
      'orange_money': { min: 100, max: 2000000 },
      'mtn_money': { min: 100, max: 1500000 }
    };
    
    return limits[method as keyof typeof limits] || { min: 0, max: 0 };
  }
}

export const paymentService = new PaymentService();