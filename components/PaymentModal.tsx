'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, DollarSign, Shield, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { paymentService, PaymentRequest } from '@/lib/paymentService';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'mobile' | 'digital';
  icon: any;
  description: string;
  fee?: number;
  processingTime: string;
  available: boolean;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Carte Bancaire',
    type: 'card',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    fee: 0,
    processingTime: 'Immédiat',
    available: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'digital',
    icon: DollarSign,
    description: 'Paiement sécurisé avec votre compte PayPal',
    fee: 0,
    processingTime: 'Immédiat',
    available: true
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    type: 'mobile',
    icon: Smartphone,
    description: 'Paiement mobile Orange Money',
    fee: 50,
    processingTime: '2-5 minutes',
    available: true
  },
  {
    id: 'mtn_money',
    name: 'MTN Money',
    type: 'mobile',
    icon: Smartphone,
    description: 'Paiement mobile MTN Money',
    fee: 50,
    processingTime: '2-5 minutes',
    available: true
  }
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (paymentData: any) => void;
}

interface CardData {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface MobileMoneyData {
  phoneNumber: string;
  pin?: string;
}

export default function PaymentModal({ isOpen, onClose, amount, onPaymentSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'details' | 'processing' | 'success'>('select');
  
  // Données des formulaires
  const [cardData, setCardData] = useState<CardData>({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  
  const [mobileData, setMobileData] = useState<MobileMoneyData>({
    phoneNumber: '',
    pin: ''
  });

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  const formatPhone = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
  };

  const getMethodConfig = (methodId: string) => {
    return PAYMENT_METHODS.find(m => m.id === methodId);
  };

  const validateCardData = () => {
    const { number, expiry, cvv, name } = cardData;
    const cleanNumber = number.replace(/\s/g, '');
    
    if (cleanNumber.length < 16 || cleanNumber.length > 19) return false;
    if (expiry.length !== 5) return false;
    if (cvv.length < 3 || cvv.length > 4) return false;
    if (name.length < 2) return false;
    
    return true;
  };

  const validateMobileData = () => {
    const { phoneNumber } = mobileData;
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (selectedMethod === 'orange_money') {
      return cleanPhone.startsWith('237') && cleanPhone.length === 12;
    } else if (selectedMethod === 'mtn_money') {
      return cleanPhone.startsWith('237') && cleanPhone.length === 12;
    }
    
    return false;
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('details');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      // Validation selon la méthode
      let isValid = false;
      
      if (selectedMethod === 'card') {
        isValid = validateCardData();
      } else if (selectedMethod === 'orange_money' || selectedMethod === 'mtn_money') {
        isValid = validateMobileData();
      } else if (selectedMethod === 'paypal') {
        isValid = true; // PayPal gérera sa propre validation
      }

      if (!isValid) {
        throw new Error('Données de paiement invalides');
      }

      // Préparer les données de paiement
      const paymentData: PaymentRequest = {
        amount,
        currency: 'FCFA',
        paymentMethod: selectedMethod,
        customerData: {
          name: selectedMethod === 'card' ? cardData.name : undefined,
          phone: selectedMethod.includes('money') ? mobileData.phoneNumber : undefined
        }
      };

      // Ajouter les données spécifiques selon la méthode
      if (selectedMethod === 'card') {
        paymentData.cardData = cardData;
      } else if (selectedMethod === 'orange_money' || selectedMethod === 'mtn_money') {
        paymentData.mobileData = mobileData;
      }

      // Traitement du paiement via le service
      const result = await paymentService.processPayment(paymentData);

      if (result.success) {
        setStep('success');
        
        setTimeout(() => {
          onPaymentSuccess({
            method: selectedMethod,
            amount,
            transactionId: result.transactionId,
            timestamp: new Date().toISOString(),
            status: result.status,
            data: result.data
          });
          handleClose();
        }, 2000);
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur de paiement. Veuillez réessayer.');
      setStep('details');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setSelectedMethod('');
    setCardData({ number: '', expiry: '', cvv: '', name: '' });
    setMobileData({ phoneNumber: '', pin: '' });
    onClose();
  };

  const renderPaymentForm = () => {
    const method = getMethodConfig(selectedMethod);
    if (!method) return null;

    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Numéro de carte
              </label>
              <input
                type="text"
                value={cardData.number}
                onChange={(e) => setCardData(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                placeholder="1234 5678 9012 3456"
                maxLength={23}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date d'expiration
                </label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => setCardData(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                  placeholder="MM/AA"
                  maxLength={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nom du titulaire
              </label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                placeholder="JOHN DOE"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
              />
            </div>
          </div>
        );

      case 'orange_money':
      case 'mtn_money':
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-orange-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Information importante</span>
              </div>
              <p className="text-sm text-orange-700 mt-2">
                Vous recevrez un SMS avec un code de confirmation sur votre téléphone.
                Frais de transaction : {method.fee} FCFA
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={mobileData.phoneNumber}
                onChange={(e) => setMobileData(prev => ({ ...prev, phoneNumber: formatPhone(e.target.value) }))}
                placeholder="+237 6XX XX XX XX"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
              />
            </div>
            
            <div className="text-sm text-gray-600">
              <p>• Assurez-vous que votre solde est suffisant</p>
              <p>• Gardez votre téléphone à portée de main</p>
              <p>• Temps de traitement : {method.processingTime}</p>
            </div>
          </div>
        );

      case 'paypal':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Paiement PayPal
              </h3>
              <p className="text-blue-700">
                Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
              </p>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>• Paiement instantané et sécurisé</p>
              <p>• Protection acheteur PayPal</p>
              <p>• Aucun frais supplémentaire</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {step === 'select' && (
          <>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Choisir un moyen de paiement</h2>
              <p className="text-gray-600 mt-2">Montant à payer : <span className="font-bold text-green-900">{amount.toLocaleString()} FCFA</span></p>
            </div>
            
            <div className="p-6 space-y-4">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    disabled={!method.available}
                    className="w-full p-4 border border-gray-200 rounded-xl hover:border-green-900 hover:bg-green-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          method.type === 'card' ? 'bg-blue-100 text-blue-600' :
                          method.type === 'mobile' ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                          {method.fee && method.fee > 0 && (
                            <p className="text-xs text-orange-600">Frais : {method.fee} FCFA</p>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleClose}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setStep('select')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {getMethodConfig(selectedMethod)?.name}
                  </h2>
                  <p className="text-gray-600">Montant : {amount.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {renderPaymentForm()}
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-900 to-green-800 text-white py-4 rounded-xl hover:from-green-800 hover:to-green-700 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Traitement...' : `Payer ${amount.toLocaleString()} FCFA`}
                </button>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Paiement sécurisé SSL 256 bits</span>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-900 border-t-transparent"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Traitement du paiement</h3>
            <p className="text-gray-600">Veuillez patienter, nous traitons votre paiement...</p>
            {(selectedMethod === 'orange_money' || selectedMethod === 'mtn_money') && (
              <p className="text-sm text-orange-600 mt-4">
                Vérifiez votre téléphone pour confirmer la transaction
              </p>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Paiement réussi !</h3>
            <p className="text-gray-600">Votre commande a été confirmée.</p>
          </div>
        )}
      </div>
    </div>
  );
}