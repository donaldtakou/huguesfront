'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Phone, Mail, CreditCard, HelpCircle, Package, Truck } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  options?: Array<{
    text: string;
    action: string;
    icon?: any;
  }>;
}

const FAQ_RESPONSES = {
  livraison: {
    content: "**Livraison & Expédition**\n\n• Livraison gratuite dès 50€\n• Expédition sous 24h\n• Suivi en temps réel\n• Livraison en 2-3 jours ouvrés",
    options: [
      { text: "Suivre ma commande", action: "track_order", icon: Package },
      { text: "Politique de retour", action: "return_policy", icon: Truck }
    ]
  },
  paiement: {
    content: " **Moyens de Paiement Acceptés**\n\n• Carte bancaire (Visa, Mastercard)\n• PayPal\n• Orange Money\n• MTN Money\n• Paiement sécurisé SSL",
    options: [
      { text: "Problème de paiement", action: "payment_issue", icon: CreditCard },
      { text: "Sécurité des paiements", action: "payment_security", icon: CreditCard }
    ]
  },
  produits: {
    content: " **Nos Produits**\n\n• Smartphones reconditionnés\n• Ordinateurs portables\n• Tablettes\n• Montres connectées\n• Garantie 12 mois minimum",
    options: [
      { text: "Voir le catalogue", action: "catalog", icon: Package },
      { text: "États des produits", action: "condition_info", icon: HelpCircle }
    ]
  },
  support: {
    content: " **Support Technique**\n\nNotre équipe est disponible pour vous aider :\n\n• Chat en direct : Lun-Ven 9h-18h\n• Email : support@fastdeal.fr\n• Téléphone : +33 1 23 45 67 89",
    options: [
      { text: "Contacter par email", action: "email_support", icon: Mail },
      { text: "Appeler le support", action: "phone_support", icon: Phone }
    ]
  },
  garantie: {
    content: " **Garantie & SAV**\n\n• Garantie constructeur 12 mois\n• SAV réactif sous 48h\n• Échange gratuit si défaut\n• Retour gratuit 14 jours",
    options: [
      { text: "Faire une réclamation", action: "warranty_claim", icon: HelpCircle },
      { text: "Contacter le SAV", action: "contact_sav", icon: Phone }
    ]
  }
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Message de bienvenue
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "👋 Bonjour ! Je suis FastBot, votre assistant virtuel.\n\nComment puis-je vous aider aujourd'hui ?",
        timestamp: new Date(),
        options: [
          { text: "Livraison & Retours", action: "livraison", icon: Truck },
          { text: "Moyens de paiement", action: "paiement", icon: CreditCard },
          { text: "Nos produits", action: "produits", icon: Package },
          { text: "Support technique", action: "support", icon: Phone },
          { text: "Garantie & SAV", action: "garantie", icon: HelpCircle }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const addMessage = (content: string, type: 'user' | 'bot', options?: any[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, 'user');

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsTyping(false);

    // Analyse simple du message pour répondre
    const lowercaseMessage = userMessage.toLowerCase();
    let response = "Je ne suis pas sûr de comprendre votre question. Voici comment je peux vous aider :";
    let responseOptions = [
      { text: "Livraison & Retours", action: "livraison", icon: Truck },
      { text: "Moyens de paiement", action: "paiement", icon: CreditCard },
      { text: "Support technique", action: "support", icon: Phone },
      { text: "Parler à un humain", action: "human_support", icon: User }
    ];

    if (lowercaseMessage.includes('livraison') || lowercaseMessage.includes('expédition') || lowercaseMessage.includes('délai')) {
      handleQuickAction('livraison');
      return;
    } else if (lowercaseMessage.includes('paiement') || lowercaseMessage.includes('carte') || lowercaseMessage.includes('paypal')) {
      handleQuickAction('paiement');
      return;
    } else if (lowercaseMessage.includes('produit') || lowercaseMessage.includes('smartphone') || lowercaseMessage.includes('ordinateur')) {
      handleQuickAction('produits');
      return;
    } else if (lowercaseMessage.includes('support') || lowercaseMessage.includes('aide') || lowercaseMessage.includes('problème')) {
      handleQuickAction('support');
      return;
    } else if (lowercaseMessage.includes('garantie') || lowercaseMessage.includes('sav') || lowercaseMessage.includes('retour')) {
      handleQuickAction('garantie');
      return;
    }

    addMessage(response, 'bot', responseOptions);
  };

  const handleQuickAction = (action: string) => {
    if (FAQ_RESPONSES[action as keyof typeof FAQ_RESPONSES]) {
      const response = FAQ_RESPONSES[action as keyof typeof FAQ_RESPONSES];
      addMessage(response.content, 'bot', response.options);
    } else {
      switch (action) {
        case 'human_support':
          addMessage(
            "**Parler à un conseiller humain**\n\nNos conseillers sont disponibles :\n\n**Téléphone:** +33 1 23 45 67 89\n**Email:** support@fastdeal.fr\n\n**Horaires:** Lun-Ven : 9h-18h",
            'bot',
            [
              { text: "Nouveau chat", action: "restart", icon: MessageCircle }
            ]
          );
          break;
        case 'email_support':
          window.open('mailto:support@fastdeal.fr?subject=Demande de support FastDeal');
          addMessage("Ouverture de votre client email...", 'bot');
          break;
        case 'phone_support':
          addMessage("**Numéro de support :** +33 1 23 45 67 89\n\n**Disponible** Lun-Ven 9h-18h", 'bot');
          break;
        case 'catalog':
          window.open('/products', '_blank');
          addMessage("Ouverture du catalogue produits...", 'bot');
          break;
        case 'restart':
          setMessages([]);
          setIsOpen(false);
          setTimeout(() => setIsOpen(true), 100);
          break;
        case 'track_order':
          addMessage(
            "**Suivi de commande**\n\nPour suivre votre commande :\n\n1. Vérifiez votre email de confirmation\n2. Cliquez sur le lien de suivi\n3. Ou connectez-vous à votre compte\n\nBesoin d'aide ? Contactez-nous avec votre numéro de commande.",
            'bot',
            [
              { text: "Mon compte", action: "account", icon: User },
              { text: "Contacter support", action: "support", icon: Phone }
            ]
          );
          break;
        case 'payment_issue':
          addMessage(
            "💳 **Problème de paiement ?**\n\nVérifiez :\n• Solde suffisant\n• Informations correctes\n• Carte non expirée\n\nToujours un problème ? Notre équipe peut vous aider !",
            'bot',
            [
              { text: "Contacter support", action: "human_support", icon: Phone },
              { text: "Moyens de paiement", action: "paiement", icon: CreditCard }
            ]
          );
          break;
        default:
          addMessage("Comment puis-je vous aider ?", 'bot', [
            { text: "Livraison", action: "livraison", icon: Truck },
            { text: "Paiement", action: "paiement", icon: CreditCard },
            { text: "Support", action: "support", icon: Phone }
          ]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 hover:scale-110 ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-gradient-to-r from-green-900 to-green-800 hover:from-green-800 hover:to-green-700'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-40 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-900 to-green-800 text-white p-4 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">FastBot</h3>
                <p className="text-sm text-green-100">Assistant virtuel • En ligne</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-green-900 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-line text-sm">{message.content}</div>
                  </div>
                  
                  {/* Quick Actions */}
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => handleQuickAction(option.action)}
                            className="flex items-center space-x-2 text-left w-full p-3 bg-white border border-gray-200 rounded-xl hover:border-green-900 hover:bg-green-50 transition-colors text-sm"
                          >
                            {Icon && <Icon className="w-4 h-4 text-green-900" />}
                            <span>{option.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'order-1 ml-2 bg-green-900' : 'order-2 mr-2 bg-orange-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-green-900 text-white p-3 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}