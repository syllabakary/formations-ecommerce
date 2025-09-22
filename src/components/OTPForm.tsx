import React, { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface OTPFormProps {
  userId: number;
  email: string;
  otp: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  onLoading: (loading: boolean) => void;
  onBack: () => void;
}

const OTPForm: React.FC<OTPFormProps> = ({
  userId,
  email,
  otp,
  onSuccess,
  onError,
  onLoading,
  onBack
}) => {
  const [otpCode, setOtpCode] = useState('');
  const { verifyOTP, resendOTP } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      onError('Veuillez entrer un code OTP valide (6 chiffres)');
      return;
    }

    onLoading(true);
    try {
      const response = await verifyOTP(userId, otpCode);

      if (response.success) {
        onSuccess();
      } else {
        onError(response.message);
      }
    } catch (error) {
      onError('Une erreur est survenue');
    } finally {
      onLoading(false);
    }
  };

  const handleResendOTP = async () => {
    onLoading(true);
    try {
      const response = await resendOTP(email);

      if (response.success) {
        onError('Nouveau code OTP envoyé avec succès !');
      } else {
        onError(response.message);
      }
    } catch (error) {
      onError('Une erreur est survenue');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={onBack}
        className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la connexion
      </button>
      <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Shield className="h-6 w-6 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Vérification OTP
      </h2>
      <p className="text-gray-600 mb-4">
        Entrez le code à 6 chiffres envoyé à <br />
        <span className="font-semibold">{email}</span>
      </p>

      {/* Display OTP for dev/testing */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 text-sm">
          <strong>Code OTP (pour dev/test):</strong> {otp}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="otp-code" className="block text-sm font-medium text-gray-700 mb-2">
            Code de vérification
          </label>
          <input
            id="otp-code"
            name="otp-code"
            type="text"
            required
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
            placeholder="123456"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Vérifier le code
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous n'avez pas reçu le code ?{' '}
            <button
              type="button"
              onClick={handleResendOTP}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Renvoyer le code
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default OTPForm;
