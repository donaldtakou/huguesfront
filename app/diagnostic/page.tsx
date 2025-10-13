'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DiagnosticPage() {
  const [tests, setTests] = useState({
    backendHealth: { status: 'testing', message: 'Test en cours...', data: null },
    productsAPI: { status: 'testing', message: 'Test en cours...', data: null },
    networkConfig: { status: 'testing', message: 'Test en cours...', data: null }
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    // Test 1: Backend Health Check
    try {
      const response = await axios.get('http://localhost:5000/api/health', { timeout: 5000 });
      setTests(prev => ({
        ...prev,
        backendHealth: { 
          status: 'success', 
          message: 'Backend accessible ✅', 
          data: response.data 
        }
      }));
    } catch (error: any) {
      setTests(prev => ({
        ...prev,
        backendHealth: { 
          status: 'error', 
          message: `Backend inaccessible ❌: ${error.message}`, 
          data: error 
        }
      }));
    }

    // Test 2: Products API
    try {
      const response = await axios.get('http://localhost:5000/api/products', { timeout: 5000 });
      setTests(prev => ({
        ...prev,
        productsAPI: { 
          status: 'success', 
          message: `API Produits OK ✅ (${response.data.products?.length || 0} produits)`, 
          data: response.data 
        }
      }));
    } catch (error: any) {
      setTests(prev => ({
        ...prev,
        productsAPI: { 
          status: 'error', 
          message: `API Produits KO ❌: ${error.message}`, 
          data: error 
        }
      }));
    }

    // Test 3: Configuration réseau
    const config = {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      nodeEnv: process.env.NODE_ENV || 'development',
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    setTests(prev => ({
      ...prev,
      networkConfig: { 
        status: 'info', 
        message: 'Configuration réseau', 
        data: config 
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'testing': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔧 Diagnostic Système</h1>
        
        <div className="space-y-6">
          {Object.entries(tests).map(([testName, result]) => (
            <div key={testName} className={`p-6 rounded-lg border-2 ${getStatusColor(result.status)}`}>
              <h2 className="text-xl font-semibold mb-3">
                {testName === 'backendHealth' && '🔌 Test Backend'}
                {testName === 'productsAPI' && '📦 Test API Produits'}
                {testName === 'networkConfig' && '⚙️ Configuration'}
              </h2>
              
              <p className="text-lg mb-4">{result.message}</p>
              
              {result.data && (
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-sm">
                    📋 Détails techniques
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-800 text-green-400 rounded text-xs overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🔧 Actions de correction</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Si le backend est inaccessible :</h3>
              <ol className="list-decimal list-inside mt-2 text-blue-800">
                <li>Ouvrir un terminal dans le dossier backend</li>
                <li>Exécuter : <code className="bg-blue-200 px-2 py-1 rounded">node index.js</code></li>
                <li>Vérifier que le serveur démarre sur le port 5000</li>
              </ol>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Si l'API produits échoue :</h3>
              <ol className="list-decimal list-inside mt-2 text-green-800">
                <li>Vérifier que MongoDB est accessible</li>
                <li>Exécuter le seed : <code className="bg-green-200 px-2 py-1 rounded">node seed.js</code></li>
                <li>Redémarrer le serveur backend</li>
              </ol>
            </div>

            <button 
              onClick={runDiagnostics}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              🔄 Relancer les tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}