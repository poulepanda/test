import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Receipt, Euro, Calendar, Search, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Facture } from './types/facture';

function App() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [filteredFactures, setFilteredFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFacture, setEditingFacture] = useState<Facture | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFactures();
  }, []);

  useEffect(() => {
    filterFactures();
  }, [factures, searchTerm]);

  async function fetchFactures() {
    try {
      const { data, error } = await supabase
        .from('factures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setFactures(data);
        setFilteredFactures(data);
        const total = data.reduce((sum, facture) => sum + facture.prix, 0);
        setTotalAmount(total);
      }
    } catch (error) {
      console.error('Error fetching factures:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterFactures() {
    if (!searchTerm.trim()) {
      setFilteredFactures(factures);
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtered = factures.filter(facture => 
      facture.nom.toLowerCase().includes(search) ||
      facture.article.toLowerCase().includes(search) ||
      facture.n_facture.toLowerCase().includes(search) ||
      facture.prix.toString().includes(search)
    );

    setFilteredFactures(filtered);
  }

  async function handleDelete(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('factures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      const updatedFactures = factures.filter(f => f.id !== id);
      setFactures(updatedFactures);
      setFilteredFactures(updatedFactures);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Erreur lors de la suppression de la facture');
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingFacture) return;

    try {
      const { error } = await supabase
        .from('factures')
        .update({
          nom: editingFacture.nom,
          article: editingFacture.article,
          prix: editingFacture.prix,
          n_facture: editingFacture.n_facture
        })
        .eq('id', editingFacture.id);

      if (error) throw error;

      // Update local state
      const updatedFactures = factures.map(f => 
        f.id === editingFacture.id ? editingFacture : f
      );
      setFactures(updatedFactures);
      setFilteredFactures(updatedFactures);
      setIsModalOpen(false);
      setEditingFacture(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Erreur lors de la mise à jour de la facture');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-6">
        <div className="flex items-center space-x-4">
          <LayoutDashboard className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold">Tableau de Bord Factures</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Factures</p>
                <p className="text-2xl font-bold">{filteredFactures.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Montant Total</p>
                <p className="text-2xl font-bold">
                  {filteredFactures.reduce((sum, f) => sum + f.prix, 0)}€
                </p>
              </div>
              <Euro className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Dernière Facture</p>
                <p className="text-2xl font-bold">
                  {filteredFactures[0]?.created_at.split('T')[0] || '-'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Liste des Factures</h2>
            
            {/* Search Input */}
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {loading ? (
            <div className="p-6 text-center">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      N° Facture
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredFactures.map((facture) => (
                    <tr key={facture.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {facture.n_facture}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(facture.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {facture.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {facture.article}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {facture.prix}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingFacture(facture);
                              setIsModalOpen(true);
                            }}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(facture.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
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
      </main>

      {/* Edit Modal */}
      {isModalOpen && editingFacture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Modifier la Facture</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingFacture(null);
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  N° Facture
                </label>
                <input
                  type="text"
                  value={editingFacture.n_facture}
                  onChange={(e) => setEditingFacture({
                    ...editingFacture,
                    n_facture: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={editingFacture.nom}
                  onChange={(e) => setEditingFacture({
                    ...editingFacture,
                    nom: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Article
                </label>
                <input
                  type="text"
                  value={editingFacture.article}
                  onChange={(e) => setEditingFacture({
                    ...editingFacture,
                    article: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  value={editingFacture.prix}
                  onChange={(e) => setEditingFacture({
                    ...editingFacture,
                    prix: Number(e.target.value)
                  })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingFacture(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;