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
    console.error('Admin API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.warn('Admin API: 401 détecté mais pas de redirection en mode admin');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints pour l'admin
export const adminEndpoints = {
  // Produits - utiliser les routes de développement
  getProducts: () => adminAPI.get(''), // GET /api/products (route publique existante)
  createProduct: (data: any) => adminAPI.post('/dev-create', data), // POST /api/products/dev-create
  updateProduct: (id: string, data: any) => adminAPI.put(`/dev-update/${id}`, data), // PUT /api/products/dev-update/:id
  deleteProduct: (id: string) => adminAPI.delete(`/dev-delete/${id}`), // DELETE /api/products/dev-delete/:id
  
  // Upload de fichiers
  uploadProductImage: (formData: FormData) => adminAPI.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Santé du serveur
  checkHealth: () => axios.get('http://localhost:5000/api/health'),
};

export default adminEndpoints;