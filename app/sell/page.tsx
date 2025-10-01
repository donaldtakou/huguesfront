'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Camera, 
  Package,
  DollarSign,
  FileText,
  Tag,
  Smartphone,
  Monitor,
  Watch,
  Laptop,
  Tablet
} from 'lucide-react';
import Logo from '@/components/Logo';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  condition: string;
  price: number;
  originalPrice?: number;
  storage?: string;
  color?: string;
  screenSize?: string;
  processor?: string;
  ram?: string;
}

export default function SellPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>();

  const watchedCategory = watch('category');
  const watchedPrice = watch('price');
  const watchedOriginalPrice = watch('originalPrice');

  const categories = [
    { value: 'smartphone', label: 'Smartphones', icon: Smartphone },
    { value: 'tablet', label: 'Tablettes', icon: Tablet },
    { value: 'laptop', label: 'Ordinateurs portables', icon: Laptop },
    { value: 'desktop', label: 'Ordinateurs de bureau', icon: Monitor },
    { value: 'smartwatch', label: 'Montres connectées', icon: Watch },
    { value: 'accessory', label: 'Accessoires', icon: Package },
    { value: 'other', label: 'Autres', icon: Package },
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent', description: 'Comme neuf, aucune trace d\'usure' },
    { value: 'very-good', label: 'Très bon', description: 'Légères traces d\'usage, excellent fonctionnement' },
    { value: 'good', label: 'Bon', description: 'Quelques signes d\'usure, bon fonctionnement' },
    { value: 'fair', label: 'Correct', description: 'Usure visible mais fonctionnel' },
    { value: 'poor', label: 'Médiocre', description: 'Forte usure, problèmes possibles' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 8) {
      toast.error('Maximum 8 images autorisées');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const calculateDiscount = () => {
    if (watchedPrice && watchedOriginalPrice && watchedOriginalPrice > watchedPrice) {
      return Math.round(((watchedOriginalPrice - watchedPrice) / watchedOriginalPrice) * 100);
    }
    return 0;
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast.error('Veuillez ajouter au moins une image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add product data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });

      // Calculate discount if original price is provided
      if (data.originalPrice && data.originalPrice > data.price) {
        const discount = Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);
        formData.append('discountPercentage', discount.toString());
      }

      // Add images
      images.forEach((image, index) => {
        formData.append('images', image);
        if (index === 0) {
          formData.append('primaryImageIndex', '0');
        }
      });

      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Produit publié avec succès !');
      router.push(`/products/${response.data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations générales</h2>
        <p className="text-gray-600">Décrivez votre produit</p>
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom du produit *
        </label>
        <input
          type="text"
          {...register('name', { required: 'Le nom du produit est requis' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: iPhone 14 Pro Max 256GB"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catégorie *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <label
                key={category.value}
                className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  watchedCategory === category.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  value={category.value}
                  {...register('category', { required: 'La catégorie est requise' })}
                  className="sr-only"
                />
                <Icon className={`w-8 h-8 mb-2 ${
                  watchedCategory === category.value ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  watchedCategory === category.value ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {category.label}
                </span>
              </label>
            );
          })}
        </div>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Brand and Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marque *
          </label>
          <input
            type="text"
            {...register('brand', { required: 'La marque est requise' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Apple, Samsung, HP..."
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modèle *
          </label>
          <input
            type="text"
            {...register('model', { required: 'Le modèle est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: iPhone 14 Pro Max, Galaxy S23..."
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          rows={6}
          {...register('description', { required: 'La description est requise' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Décrivez l'état de votre produit, ses caractéristiques, ce qui est inclus..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">État et prix</h2>
        <p className="text-gray-600">Définissez l&apos;état et le prix de votre produit</p>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          État du produit *
        </label>
        <div className="space-y-3">
          {conditions.map((condition) => (
            <label
              key={condition.value}
              className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                watch('condition') === condition.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                value={condition.value}
                {...register('condition', { required: 'L\'état est requis' })}
                className="sr-only"
              />
              <div className="flex-1">
                <div className={`font-medium ${
                  watch('condition') === condition.value ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {condition.label}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {condition.description}
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.condition && (
          <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
        )}
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix de vente (€) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('price', { 
                required: 'Le prix est requis',
                min: { value: 0, message: 'Le prix doit être positif' }
              })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix d&apos;origine (€)
            <span className="text-gray-500 font-normal"> - optionnel</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('originalPrice')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          {calculateDiscount() > 0 && (
            <p className="mt-1 text-sm text-green-600">
              Remise de {calculateDiscount()}%
            </p>
          )}
        </div>
      </div>

      {/* Technical Specs */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Caractéristiques techniques
          <span className="text-gray-500 font-normal text-sm"> - optionnel</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stockage
            </label>
            <input
              type="text"
              {...register('storage')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 256GB, 1TB..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur
            </label>
            <input
              type="text"
              {...register('color')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Noir, Blanc, Bleu..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taille écran
            </label>
            <input
              type="text"
              {...register('screenSize')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 6.7 pouces, 15.6 pouces..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processeur
            </label>
            <input
              type="text"
              {...register('processor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: A16 Bionic, Intel i7..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RAM
            </label>
            <input
              type="text"
              {...register('ram')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 8GB, 16GB..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Photos du produit</h2>
        <p className="text-gray-600">Ajoutez jusqu&apos;à 8 photos de qualité</p>
      </div>

      {/* Image Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ajoutez des photos
          </h3>
          <p className="text-gray-500 mb-4">
            La première photo sera utilisée comme photo principale
          </p>
          <label className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Choisir des fichiers</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG jusqu&apos;à 10MB chacune
          </p>
        </div>
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Photo principale
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour au tableau de bord</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <nav className="flex items-center justify-center">
            <ol className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <li key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 ml-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Étape {currentStep} sur 3
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Précédent
                  </button>
                )}
              </div>
              <div>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Publication...' : 'Publier le produit'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}