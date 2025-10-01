import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 7) {
    return formatDate(date);
  } else if (diffDays > 0) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else if (diffMinutes > 0) {
    return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else {
    return 'À l\'instant';
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    excellent: 'Excellent',
    'very-good': 'Très bon',
    good: 'Bon',
    fair: 'Correct',
    poor: 'Médiocre',
  };
  return labels[condition] || condition;
}

export function getConditionColor(condition: string): string {
  const colors: Record<string, string> = {
    excellent: 'text-green-600 bg-green-50',
    'very-good': 'text-blue-600 bg-blue-50',
    good: 'text-yellow-600 bg-yellow-50',
    fair: 'text-orange-600 bg-orange-50',
    poor: 'text-red-600 bg-red-50',
  };
  return colors[condition] || 'text-gray-600 bg-gray-50';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    smartphone: 'Smartphones',
    tablet: 'Tablettes',
    smartwatch: 'Montres connectées',
    laptop: 'Ordinateurs portables',
    desktop: 'Ordinateurs de bureau',
    accessory: 'Accessoires',
    other: 'Autres',
  };
  return labels[category] || category;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    smartphone: '📱',
    tablet: '📱',
    smartwatch: '⌚',
    laptop: '💻',
    desktop: '🖥️',
    accessory: '🔌',
    other: '📦',
  };
  return icons[category] || '📦';
}

export function getAvailabilityLabel(availability: string): string {
  const labels: Record<string, string> = {
    'in-stock': 'Disponible',
    'out-of-stock': 'Épuisé',
    reserved: 'Réservé',
  };
  return labels[availability] || availability;
}

export function getAvailabilityColor(availability: string): string {
  const colors: Record<string, string> = {
    'in-stock': 'text-green-600 bg-green-50',
    'out-of-stock': 'text-red-600 bg-red-50',
    reserved: 'text-yellow-600 bg-yellow-50',
  };
  return colors[availability] || 'text-gray-600 bg-gray-50';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    processing: 'En traitement',
    shipped: 'Expédié',
    delivered: 'Livré',
    cancelled: 'Annulé',
    refunded: 'Remboursé',
    disputed: 'Litige',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-50',
    confirmed: 'text-blue-600 bg-blue-50',
    processing: 'text-indigo-600 bg-indigo-50',
    shipped: 'text-purple-600 bg-purple-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
    refunded: 'text-orange-600 bg-orange-50',
    disputed: 'text-gray-600 bg-gray-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
}

export function generateSEOTitle(productName: string, brand: string, price: number): string {
  return `${productName} ${brand} - ${formatPrice(price)} | FastDeal`;
}

export function generateSEODescription(product: any): string {
  const { name, brand, condition, price, category } = product;
  return `${name} ${brand} en ${getConditionLabel(condition).toLowerCase()} à ${formatPrice(price)}. ${getCategoryLabel(category)} d'occasion en excellent état sur FastDeal.`;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateProductSlug(product: any): string {
  return `${slugify(product.name)}-${product._id}`;
}

export function parseProductSlug(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1]; // Return the ID part
}

export function calculateDiscountPercentage(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}