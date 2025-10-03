import React, { useState } from 'react';
import { CreditCard, Lock, Mail, CheckCircle } from 'lucide-react';
import Modal from './Modal';
import { Formation } from '../types';
import { emailService } from '../services/emailService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formation: Formation;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  formation, 
  onPaymentSuccess 
}) => {
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    acceptTerms: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStep('processing');

    try {
      // Simuler le traitement du paiement
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Envoyer l'email de confirmation avec les identifiants
      const emailSent = await emailService.sendPaymentConfirmation({
        userName: formData.name,
        userEmail: formData.email,
        formationTitle: formation.title,
        price: formation.price,
        paymentDate: new Date().toISOString()
      });

      if (emailSent) {
        setStep('success');
        onPaymentSuccess();
      } else {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
      setStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-[#A553C4] to-[#6636DD] rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{formation.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg">Prix total</span>
          <span className="text-2xl font-bold">{(formation.price / 100).toFixed(2)}€</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            placeholder="Jean Dupont"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            placeholder="jean.dupont@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de carte *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={formData.cardNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
            className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'expiration *
          </label>
          <input
            type="text"
            required
            value={formData.expiryDate}
            onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
            placeholder="MM/AA"
            maxLength={5}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.cvv}
              onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A553C4] focus:border-transparent"
              placeholder="123"
              maxLength={4}
            />
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          required
          checked={formData.acceptTerms}
          onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
          className="mr-2 text-[#A553C4] focus:ring-[#A553C4]"
        />
        <span className="text-sm text-gray-700">
          J'accepte les conditions générales de vente
        </span>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Traitement...' : `Payer ${(formation.price / 100).toFixed(2)}€`}
      </button>
    </form>
  );

  const renderProcessing = () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A553C4] mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Traitement du paiement...</h3>
      <p className="text-gray-600">Veuillez patienter, nous traitons votre paiement et préparons vos accès.</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-12">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Paiement réussi !</h3>
      <p className="text-gray-600 mb-4">
        Votre paiement a été traité avec succès. Vous allez recevoir un email avec vos identifiants d'accès.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Mail className="w-5 h-5 text-blue-500 mr-2" />
          <p className="text-blue-800 text-sm">
            Email envoyé à <strong>{formData.email}</strong>
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="bg-gradient-to-r from-[#A553C4] to-[#6636DD] text-white py-2 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
      >
        Fermer
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === 'payment' ? 'Finaliser votre achat' :
        step === 'processing' ? 'Traitement en cours' :
        'Achat confirmé'
      }
      size="lg"
    >
      {step === 'payment' && renderPaymentForm()}
      {step === 'processing' && renderProcessing()}
      {step === 'success' && renderSuccess()}
    </Modal>
  );
};

export default PaymentModal;