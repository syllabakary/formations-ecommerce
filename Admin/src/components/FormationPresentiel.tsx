import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Clock,
  AlertCircle,
  Check,
  X,
  Loader2,
  FileText,
  DollarSign,
  TrendingUp,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

// Types
interface InPersonTraining {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: number;
  category: { id: number; name: string };
  city_id: number;
  city: { id: number; name: string };
  trainer_id: number;
  trainer: { id: number; name: string; rating: number };
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  duration_days: number;
  max_seats: number;
  available_seats: number;
  price: number;
  original_price?: number;
  image?: string;
  agenda?: string[];
  includes?: string[];
  requirements?: string[];
  rating: number;
  total_reviews: number;
  is_popular: boolean;
  is_upcoming: boolean;
  is_active: boolean;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface Trainer {
  id: number;
  name: string;
  rating: number;
}

// Composant d'upload d'images
interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "Image de la formation" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      alert('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    setUploading(true);

    try {
      // Option 1: Upload vers l'API Laravel (recommandé en production)
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'training');

      const response = await fetch('/api/v1/upload/training-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, // Si auth requise
        },
      });

      if (response.ok) {
        const result = await response.json();
        onChange(result.url);
      } else {
        throw new Error('Erreur upload serveur');
      }
      
    } catch (error) {
      console.error('Erreur upload:', error);
      
      // Fallback: Conversion en base64 pour la démo locale
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } catch (fallbackError) {
        alert('Erreur lors de l\'upload de l\'image');
      }
    } finally {
      setUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {value ? (
        // Affichage de l'image avec options
        <div className="relative">
          <img
            src={value}
            alt="Aperçu"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={openFileDialog}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                title="Changer l'image"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                title="Supprimer l'image"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Zone de drop/upload
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Upload en cours...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Cliquez pour sélectionner ou glissez une image ici
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, JPEG jusqu'à 5MB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
      />

      {/* Option URL manuelle */}
      <div className="text-center">
        <span className="text-xs text-gray-500">ou</span>
      </div>
      
      <div>
        <input
          type="url"
          placeholder="Coller l'URL d'une image..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          onChange={(e) => onChange(e.target.value)}
          value={typeof value === 'string' && value.startsWith('http') ? value : ''}
        />
      </div>
    </div>
  );
};
const useLocalData = () => {
  const [trainings, setTrainings] = useState<InPersonTraining[]>([
    {
      id: 1,
      title: "Formation React Avancée",
      slug: "formation-react-avancee",
      description: "Maîtrisez les concepts avancés de React avec des projets pratiques",
      short_description: "React avancé avec hooks, context et performance",
      category_id: 1,
      category: { id: 1, name: "Développement Web" },
      city_id: 1,
      city: { id: 1, name: "Abidjan" },
      trainer_id: 1,
      trainer: { id: 1, name: "Jean Kouassi", rating: 4.8 },
      start_date: "2025-10-15",
      end_date: "2025-10-17",
      start_time: "09:00",
      end_time: "17:00",
      duration_days: 3,
      max_seats: 20,
      available_seats: 15,
      price: 150000,
      original_price: 180000,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
      agenda: ["Introduction aux hooks", "Context API", "Optimisation des performances"],
      includes: ["Support de cours", "Certificat", "Projet pratique"],
      requirements: ["Connaissance de base en React", "Ordinateur portable"],
      rating: 4.7,
      total_reviews: 24,
      is_popular: true,
      is_upcoming: true,
      is_active: true,
      status: 'published',
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-01-15T10:00:00Z"
    }
  ]);

  const [categories] = useState<Category[]>([
    { id: 1, name: "Développement Web" },
    { id: 2, name: "Design UI/UX" },
    { id: 3, name: "Marketing Digital" },
    { id: 4, name: "Business" }
  ]);

  const [cities] = useState<City[]>([
    { id: 1, name: "Abidjan" },
    { id: 2, name: "Bouaké" },
    { id: 3, name: "San Pedro" },
    { id: 4, name: "Yamoussoukro" }
  ]);

  const [trainers] = useState<Trainer[]>([
    { id: 1, name: "Jean Kouassi", rating: 4.8 },
    { id: 2, name: "Marie Diabaté", rating: 4.9 },
    { id: 3, name: "Paul Ouattara", rating: 4.6 }
  ]);

  return { trainings, setTrainings, categories, cities, trainers };
};

// Composant Modal de confirmation
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'danger' 
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium ${colors[type]}`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Modal de formation
interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  training?: InPersonTraining;
  onSave: (training: Omit<InPersonTraining, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
  cities: City[];
  trainers: Trainer[];
}

const TrainingModal: React.FC<TrainingModalProps> = ({ 
  isOpen, 
  onClose, 
  training, 
  onSave, 
  categories, 
  cities, 
  trainers 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category_id: 0,
    city_id: 0,
    trainer_id: 0,
    start_date: '',
    end_date: '',
    start_time: '09:00',
    end_time: '17:00',
    duration_days: 1,
    max_seats: 20,
    price: 0,
    original_price: 0,
    image: '',
    agenda: [] as string[],
    includes: [] as string[],
    requirements: [] as string[],
    is_popular: false,
    is_active: true,
    status: 'draft' as const
  });

  const [agendaInput, setAgendaInput] = useState('');
  const [includesInput, setIncludesInput] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (training && isOpen) {
      setFormData({
        title: training.title,
        description: training.description,
        short_description: training.short_description,
        category_id: training.category_id,
        city_id: training.city_id,
        trainer_id: training.trainer_id,
        start_date: training.start_date,
        end_date: training.end_date,
        start_time: training.start_time,
        end_time: training.end_time,
        duration_days: training.duration_days,
        max_seats: training.max_seats,
        price: training.price,
        original_price: training.original_price || 0,
        image: training.image || '',
        agenda: training.agenda || [],
        includes: training.includes || [],
        requirements: training.requirements || [],
        is_popular: training.is_popular,
        is_active: training.is_active,
        status: training.status
      });
    } else if (isOpen && !training) {
      // Reset pour nouvelle formation
      setFormData({
        title: '',
        description: '',
        short_description: '',
        category_id: 0,
        city_id: 0,
        trainer_id: 0,
        start_date: '',
        end_date: '',
        start_time: '09:00',
        end_time: '17:00',
        duration_days: 1,
        max_seats: 20,
        price: 0,
        original_price: 0,
        image: '',
        agenda: [],
        includes: [],
        requirements: [],
        is_popular: false,
        is_active: true,
        status: 'draft'
      });
    }
  }, [training, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Calcul automatique des champs dérivés
    const categoryObj = categories.find(c => c.id === formData.category_id);
    const cityObj = cities.find(c => c.id === formData.city_id);
    const trainerObj = trainers.find(t => t.id === formData.trainer_id);

    if (!categoryObj || !cityObj || !trainerObj) {
      setLoading(false);
      return;
    }

    const trainingData = {
      ...formData,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: categoryObj,
      city: cityObj,
      trainer: trainerObj,
      available_seats: formData.max_seats,
      rating: training?.rating || 0,
      total_reviews: training?.total_reviews || 0,
      is_upcoming: new Date(formData.start_date) > new Date()
    };

    try {
      onSave(trainingData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const addToList = (type: 'agenda' | 'includes' | 'requirements', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()]
      }));
      
      if (type === 'agenda') setAgendaInput('');
      if (type === 'includes') setIncludesInput('');
      if (type === 'requirements') setRequirementsInput('');
    }
  };

  const removeFromList = (type: 'agenda' | 'includes' | 'requirements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {training ? 'Modifier la formation' : 'Nouvelle formation'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la formation *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description courte *
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description complète *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={0}>Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <select
                value={formData.city_id}
                onChange={(e) => setFormData({...formData, city_id: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={0}>Sélectionner une ville</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formateur *
              </label>
              <select
                value={formData.trainer_id}
                onChange={(e) => setFormData({...formData, trainer_id: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={0}>Sélectionner un formateur</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name} ({trainer.rating}/5)
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <ImageUpload
                value={formData.image}
                onChange={(imageUrl) => setFormData({...formData, image: imageUrl})}
                label="Image de la formation"
              />
            </div>
          </div>

          {/* Dates et horaires */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates et horaires</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de début
                </label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de fin
                </label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Capacité et prix */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacité et tarification</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (jours) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({...formData, duration_days: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Places maximum *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_seats}
                  onChange={(e) => setFormData({...formData, max_seats: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (FCFA) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix original (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.original_price}
                  onChange={(e) => setFormData({...formData, original_price: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Détails de la formation */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la formation</h3>
            
            {/* Programme */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programme
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={agendaInput}
                  onChange={(e) => setAgendaInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ajouter un élément du programme"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('agenda', agendaInput))}
                />
                <button
                  type="button"
                  onClick={() => addToList('agenda', agendaInput)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {formData.agenda.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeFromList('agenda', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclus */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inclus dans la formation
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={includesInput}
                  onChange={(e) => setIncludesInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ce qui est inclus"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('includes', includesInput))}
                />
                <button
                  type="button"
                  onClick={() => addToList('includes', includesInput)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeFromList('includes', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Prérequis */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prérequis
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ajouter un prérequis"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('requirements', requirementsInput))}
                />
                <button
                  type="button"
                  onClick={() => addToList('requirements', requirementsInput)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {formData.requirements.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeFromList('requirements', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="cancelled">Annulé</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_popular"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({...formData, is_popular: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_popular" className="ml-2 text-sm font-medium text-gray-700">
                  Formation populaire
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                  Formation active
                </label>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                training ? 'Mettre à jour' : 'Créer la formation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant principal
const InPersonTrainingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<InPersonTraining | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<InPersonTraining | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { trainings, setTrainings, categories, cities, trainers } = useLocalData();

  const handleCreateTraining = () => {
    setEditingTraining(undefined);
    setIsModalOpen(true);
  };

  const handleEditTraining = (training: InPersonTraining) => {
    setEditingTraining(training);
    setIsModalOpen(true);
  };

  const handleSaveTraining = (trainingData: Omit<InPersonTraining, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (editingTraining) {
      // Mise à jour
      setTrainings(prev => prev.map(t => 
        t.id === editingTraining.id 
          ? { ...trainingData, id: editingTraining.id, createdAt: editingTraining.createdAt, updatedAt: now }
          : t
      ));
      setSuccessMessage('Formation mise à jour avec succès !');
    } else {
      // Création
      const newId = Math.max(...trainings.map(t => t.id), 0) + 1;
      const newTraining: InPersonTraining = {
        ...trainingData,
        id: newId,
        createdAt: now,
        updatedAt: now
      };
      setTrainings(prev => [...prev, newTraining]);
      setSuccessMessage('Formation créée avec succès !');
    }

    // Effacer le message après 3 secondes
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteTraining = (training: InPersonTraining) => {
    setTrainingToDelete(training);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (trainingToDelete) {
      setTrainings(prev => prev.filter(t => t.id !== trainingToDelete.id));
      setTrainingToDelete(null);
      setSuccessMessage('Formation supprimée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDuplicateTraining = (training: InPersonTraining) => {
    const duplicatedTraining = {
      ...training,
      title: `${training.title} (Copie)`,
      slug: `${training.slug}-copie`,
      status: 'draft' as const,
      start_date: '',
      end_date: '',
      available_seats: training.max_seats
    };
    
    const newId = Math.max(...trainings.map(t => t.id), 0) + 1;
    const newTraining: InPersonTraining = {
      ...duplicatedTraining,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTrainings(prev => [...prev, newTraining]);
    setSuccessMessage('Formation dupliquée avec succès !');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.city.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || training.category.name === filterCategory;
    const matchesStatus = filterStatus === 'all' || training.status === filterStatus;
    const matchesCity = filterCity === 'all' || training.city.name === filterCity;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesCity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (date: string) => {
    if (!date) return 'Non programmé';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Message de succès */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Formations en Présentiel</h1>
          <p className="text-gray-600">Gérez vos formations et sessions en présentiel</p>
        </div>
        
        <button 
          onClick={handleCreateTraining}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nouvelle Formation</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtre par catégorie */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="cancelled">Annulé</option>
            <option value="completed">Terminé</option>
          </select>

          {/* Filtre par ville */}
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes villes</option>
            {cities.map(city => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-800">{trainings.length}</div>
              <div className="text-sm text-gray-600">Total Formations</div>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {trainings.filter(t => t.status === 'published').length}
              </div>
              <div className="text-sm text-gray-600">Publiées</div>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {trainings.reduce((acc, t) => acc + (t.max_seats - t.available_seats), 0)}
              </div>
              <div className="text-sm text-gray-600">Inscriptions</div>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {formatPrice(trainings.reduce((acc, t) => acc + (t.price * (t.max_seats - t.available_seats)), 0)).replace(' FCFA', '')}
              </div>
              <div className="text-sm text-gray-600">Revenus (FCFA)</div>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Liste des formations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredTrainings.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Aucune formation trouvée</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' || filterCity !== 'all'
                ? "Essayez de modifier vos critères de recherche"
                : "Commencez par créer votre première formation"}
            </p>
            <button
              onClick={handleCreateTraining}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Créer une formation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Détails
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscriptions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrainings.map((training) => (
                  <tr key={training.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-24">
                          <img 
                            className="h-16 w-24 object-cover rounded-lg" 
                            src={training.image || 'https://via.placeholder.com/150x100'} 
                            alt={training.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {training.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {training.category.name}
                          </div>
                          {training.is_popular && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Populaire
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {training.city.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {formatDate(training.start_date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          {training.duration_days} jour{training.duration_days > 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          {training.rating}/5 ({training.total_reviews} avis)
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          {training.max_seats - training.available_seats}/{training.max_seats}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${((training.max_seats - training.available_seats) / training.max_seats) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {training.available_seats} places restantes
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(training.price)}
                        </div>
                        {training.original_price && training.original_price > training.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(training.original_price)}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Revenus: {formatPrice(training.price * (training.max_seats - training.available_seats))}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}>
                        {getStatusText(training.status)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => console.log('Voir détails:', training.id)}
                          className="text-gray-400 hover:text-blue-600 p-1 rounded"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditTraining(training)}
                          className="text-gray-400 hover:text-blue-600 p-1 rounded"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateTraining(training)}
                          className="text-gray-400 hover:text-green-600 p-1 rounded"
                          title="Dupliquer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTraining(training)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <TrainingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        training={editingTraining}
        onSave={handleSaveTraining}
        categories={categories}
        cities={cities}
        trainers={trainers}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer la formation"
        message={`Êtes-vous sûr de vouloir supprimer la formation "${trainingToDelete?.title}" ? Cette action est irréversible.`}
        type="danger"
      />
    </div>
  );
};

export default InPersonTrainingManagement;