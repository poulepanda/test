import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Facture } from '../types/facture';
import { useTheme } from '../contexts/ThemeContext';

export default function Site() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<Omit<Facture, 'id' | 'created_at'>>({
    nom: '',
    article: '',
    prix: 0,
    n_facture: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getCardClasses = () => {
    return theme === 'light'
      ? 'bg-sky-50 shadow-lg'
      : 'bg-gray-800';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('factures')
        .insert([formData]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        nom: '',
        article: '',
        prix: 0,
        n_facture: ''
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Erreur lors de la création de la facture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Créer une Nouvelle Facture
        </h1>
        
        <form onSubmit={handleSubmit} className={`${getCardClasses()} rounded-lg p-6 space-y-6`}>
          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              N° Facture
            </label>
            <input
              type="text"
              value={formData.n_facture}
              onChange={(e) => setFormData({ ...formData, n_facture: e.target.value })}
              required
              className={`w-full px-3 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                  : 'bg-gray-700 text-white placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="FAC-001"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Nom
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
              className={`w-full px-3 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                  : 'bg-gray-700 text-white placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Nom du client"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Article
            </label>
            <input
              type="text"
              value={formData.article}
              onChange={(e) => setFormData({ ...formData, article: e.target.value })}
              required
              className={`w-full px-3 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                  : 'bg-gray-700 text-white placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Description de l'article"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Prix (€)
            </label>
            <input
              type="number"
              value={formData.prix}
              onChange={(e) => setFormData({ ...formData, prix: Number(e.target.value) })}
              required
              min="0"
              className={`w-full px-3 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                  : 'bg-gray-700 text-white placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="0"
            />
          </div>

          {success && (
            <div className="bg-green-500 bg-opacity-10 text-green-500 px-4 py-2 rounded-lg">
              Facture créée avec succès!
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              } transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Création...' : 'Créer la Facture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}