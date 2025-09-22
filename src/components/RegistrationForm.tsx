import React, { useState } from 'react';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegistrationFormProps {
  onSuccess: (userId: number, otp: string) => void;
  onError: (message: string) => void;
  onLoading: (loading: boolean) => void;
}

interface FormData {
  email: string;
  phone: string;
  password: string;
  name: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, onError, onLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    password: '',
    name: ''
  });

  const { register } = useAuth();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.password) {
      onError('Veuillez remplir tous les champs');
      return;
    }

    if (formData.password.length < 6) {
      onError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    onLoading(true);
    try {
      const response = await register(formData.email, formData.phone, formData.password);

      if (response.success && response.user_id && response.otp) {
        onSuccess(response.user_id, response.otp);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Adresse email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="exemple@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de téléphone
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+225 12 34 56 78"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Le mot de passe doit contenir au moins 6 caractères
        </p>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        S'inscrire
      </button>
    </form>
  );
};

export default RegistrationForm;
