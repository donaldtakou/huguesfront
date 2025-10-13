'use client';

import ProductImage from '@/components/ProductImage';

export default function ImageTestPage() {
  const testCases = [
    {
      title: "Image avec URL valide",
      src: "https://via.placeholder.com/200x200/10B981/FFFFFF?text=Valid+Image",
      category: "smartphone"
    },
    {
      title: "Image avec URL invalide",
      src: "https://invalid-url-that-does-not-exist.com/image.jpg", 
      category: "smartphone"
    },
    {
      title: "Image sans src (undefined)",
      src: undefined,
      category: "laptop"
    },
    {
      title: "Image sans src ni category",
      src: undefined,
      category: undefined
    },
    {
      title: "Image avec category tablet",
      src: undefined,
      category: "tablet"
    },
    {
      title: "Image avec category smartwatch", 
      src: undefined,
      category: "smartwatch"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test d'affichage des images</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testCases.map((testCase, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48">
                <ProductImage
                  src={testCase.src}
                  alt={`Test image ${index + 1}`}
                  className="w-full h-full"
                  category={testCase.category}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{testCase.title}</h3>
                <div className="text-sm text-gray-500">
                  <p>Category: {testCase.category || 'undefined'}</p>
                  <p>Source: {testCase.src ? 'URL fournie' : 'undefined'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">État attendu :</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Image valide :</strong> Affiche l'image normalement</li>
            <li>• <strong>Image invalide :</strong> Affiche le placeholder SVG avec icône "Image non disponible"</li>
            <li>• <strong>Pas de src :</strong> Affiche directement le placeholder approprié selon la catégorie</li>
            <li>• <strong>Catégories :</strong> Chaque catégorie a son propre placeholder SVG spécialisé</li>
            <li>• <strong>Fallback par défaut :</strong> Si pas de catégorie, utilise un placeholder générique</li>
          </ul>
        </div>
      </div>
    </div>
  );
}