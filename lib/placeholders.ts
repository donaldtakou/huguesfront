// Placeholder image pour les produits sans image
export const PLACEHOLDER_IMAGES = {
  // Images par catégorie
  smartphone: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect width="200" height="300" fill="%23f0f4f8"/%3E%3Crect x="20" y="30" width="160" height="240" rx="15" fill="%23ffffff" stroke="%2364748b" stroke-width="2"/%3E%3Crect x="30" y="50" width="140" height="180" fill="%236b7280"/%3E%3Ccircle cx="100" cy="250" r="8" fill="%236b7280"/%3E%3Ctext x="100" y="285" text-anchor="middle" fill="%236b7280" font-size="12" font-family="Arial"%3ESmartphone%3C/text%3E%3C/svg%3E',
  
  laptop: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f0f4f8"/%3E%3Crect x="30" y="30" width="240" height="120" rx="8" fill="%23ffffff" stroke="%2364748b" stroke-width="2"/%3E%3Crect x="40" y="40" width="220" height="100" fill="%236b7280"/%3E%3Crect x="20" y="150" width="260" height="20" rx="4" fill="%2364748b"/%3E%3Ctext x="150" y="185" text-anchor="middle" fill="%236b7280" font-size="12" font-family="Arial"%3EOrdinateur%3C/text%3E%3C/svg%3E',
  
  tablet: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300"%3E%3Crect width="240" height="300" fill="%23f0f4f8"/%3E%3Crect x="20" y="20" width="200" height="260" rx="12" fill="%23ffffff" stroke="%2364748b" stroke-width="2"/%3E%3Crect x="30" y="40" width="180" height="220" fill="%236b7280"/%3E%3Ccircle cx="120" cy="35" r="3" fill="%236b7280"/%3E%3Ctext x="120" y="290" text-anchor="middle" fill="%236b7280" font-size="12" font-family="Arial"%3ETablette%3C/text%3E%3C/svg%3E',
  
  smartwatch: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f4f8"/%3E%3Crect x="60" y="40" width="80" height="120" rx="20" fill="%23ffffff" stroke="%2364748b" stroke-width="2"/%3E%3Crect x="70" y="50" width="60" height="100" rx="15" fill="%236b7280"/%3E%3Crect x="50" y="80" width="20" height="40" rx="4" fill="%2364748b"/%3E%3Crect x="130" y="80" width="20" height="40" rx="4" fill="%2364748b"/%3E%3Ctext x="100" y="185" text-anchor="middle" fill="%236b7280" font-size="12" font-family="Arial"%3EMontre%3C/text%3E%3C/svg%3E',
  
  // Image par défaut
  default: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f4f8"/%3E%3Crect x="40" y="40" width="120" height="120" rx="12" fill="%23ffffff" stroke="%2364748b" stroke-width="2"/%3E%3Cpath d="M70 80l20 20 40-40" stroke="%2310b981" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/%3E%3Ctext x="100" y="185" text-anchor="middle" fill="%236b7280" font-size="12" font-family="Arial"%3EProduit%3C/text%3E%3C/svg%3E'
};

export function getPlaceholderImage(category?: string): string {
  if (!category) return PLACEHOLDER_IMAGES.default;
  
  const categoryKey = category.toLowerCase() as keyof typeof PLACEHOLDER_IMAGES;
  return PLACEHOLDER_IMAGES[categoryKey] || PLACEHOLDER_IMAGES.default;
}