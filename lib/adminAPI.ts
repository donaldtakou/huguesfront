import axios from 'axios';

// Instance d'API spécifique pour l'admin qui bypasse l'authentification
const adminAPI = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com/api'
    : 'http://localhost:5000/api/products', // Utiliser les routes publiques existantes
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// PAS d'intercepteur d'authentification - accès direct
adminAPI.interceptors.request.use(
  (config) => {
    console.log('Admin API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gestion des erreurs sans redirection
adminAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Améliorer les messages d'erreur
    if (error.code === 'ERR_NETWORK' || error.code === 'NETWORK_ERROR') {
      console.error('Admin API Error: Serveur non accessible (ERR_NETWORK)');
      console.error('Vérifiez que le serveur backend est démarré sur le port 5000');
    } else {
      console.error('Admin API Error:', error.response?.status, error.response?.data);
    }
    
    if (error.response?.status === 401) {
      console.warn('Admin API: 401 détecté mais pas de redirection en mode admin');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints pour l'admin - pas utilisé directement dans le nouveau code
export const adminEndpoints = {
  // Produits - utiliser les routes de développement
  getProducts: () => adminAPI.get(''), // GET /api/products (route publique existante)
  createProduct: (data: any) => adminAPI.post('/dev-create', data), // POST /api/products/dev-create
  updateProduct: (id: string, data: any) => adminAPI.put(`/dev-update/${id}`, data), // PUT /api/products/dev-update/:id
  deleteProduct: (id: string) => adminAPI.delete(`/dev-delete/${id}`), // DELETE /api/products/dev-delete/:id
  
  // Upload de fichiers - utiliser la nouvelle route single image
  uploadProductImage: (formData: FormData) => axios.post('http://localhost:5000/api/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000 // 30 secondes pour les uploads
  }),
  
  // Upload multiple images (si nécessaire)
  uploadMultipleImages: (formData: FormData) => axios.post('http://localhost:5000/api/upload/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000
  }),
  
  // Lister les images disponibles
  listImages: () => axios.get('http://localhost:5000/api/upload/images'),
  
  // Supprimer une image
  deleteImage: (filename: string) => axios.delete(`http://localhost:5000/api/upload/${filename}`),
  
  // Santé du serveur
  checkHealth: () => axios.get('http://localhost:5000/api/health'),
};

export default adminEndpoints;