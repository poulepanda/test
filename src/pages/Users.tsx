import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { Edit2, Save, X, Mail, Phone, MapPin, Globe2 } from 'lucide-react';
import type { User } from '../types/user';

export default function Users() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const getCardClasses = () => {
    return theme === 'light'
      ? 'bg-sky-50 shadow-lg'
      : 'bg-gray-800';
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editingUser || !editForm) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          profil: editForm.profil,
          fname: editForm.fname,
          lname: editForm.lname,
          status: editForm.status,
          nb_lots: editForm.nb_lots,
          balance: editForm.balance,
          city: editForm.city,
          country: editForm.country,
          phone: editForm.phone,
          email: editForm.email,
          invest: editForm.invest,
          address: editForm.address
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      await fetchUsers();
      setEditingUser(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const getBalanceColor = (balance: number) => {
    if (theme === 'light') {
      return balance < 0 ? 'text-red-600' : 'text-green-600';
    }
    return balance < 0 ? 'text-red-500' : 'text-green-500';
  };

  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
        Users Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`${getCardClasses()} p-4 rounded-lg`}>
          <div className={theme === 'light' ? 'text-sky-900' : 'text-gray-400'}>Total Users</div>
          <div className={`text-2xl font-bold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
            {users.length}
          </div>
        </div>
        <div className={`${getCardClasses()} p-4 rounded-lg`}>
          <div className={theme === 'light' ? 'text-sky-900' : 'text-gray-400'}>Total Investment</div>
          <div className={`text-2xl font-bold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
            ${users.reduce((sum, user) => sum + (user.invest || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className={`${getCardClasses()} p-4 rounded-lg`}>
          <div className={theme === 'light' ? 'text-sky-900' : 'text-gray-400'}>Total Balance</div>
          <div className={`text-2xl font-bold ${getBalanceColor(users.reduce((sum, user) => sum + (user.balance || 0), 0))}`}>
            ${users.reduce((sum, user) => sum + (user.balance || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className={`${getCardClasses()} p-4 rounded-lg`}>
          <div className={theme === 'light' ? 'text-sky-900' : 'text-gray-400'}>Active Users</div>
          <div className={`text-2xl font-bold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
            {users.filter(user => user.status === 'active').length}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`${getCardClasses()} rounded-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'light' ? 'bg-sky-100' : 'bg-gray-700'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Name
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Contact
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Location
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Profile
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Investment
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Balance
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'light' ? 'divide-sky-200' : 'divide-gray-700'}`}>
              {users.map((user) => (
                <tr key={user.id} className={theme === 'light' ? 'hover:bg-sky-50' : 'hover:bg-gray-700'}>
                  {editingUser?.id === user.id ? (
                    // Edit Mode
                    <>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editForm.fname || ''}
                            onChange={(e) => setEditForm({ ...editForm, fname: e.target.value })}
                            className={`w-24 px-2 py-1 rounded ${
                              theme === 'light'
                                ? 'bg-white border border-sky-200'
                                : 'bg-gray-600 border-gray-500'
                            }`}
                            placeholder="First Name"
                          />
                          <input
                            type="text"
                            value={editForm.lname || ''}
                            onChange={(e) => setEditForm({ ...editForm, lname: e.target.value })}
                            className={`w-24 px-2 py-1 rounded ${
                              theme === 'light'
                                ? 'bg-white border border-sky-200'
                                : 'bg-gray-600 border-gray-500'
                            }`}
                            placeholder="Last Name"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <input
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className={`w-40 px-2 py-1 rounded ${
                                theme === 'light'
                                  ? 'bg-white border border-sky-200'
                                  : 'bg-gray-600 border-gray-500'
                              }`}
                              placeholder="Email"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <input
                              type="tel"
                              value={editForm.phone || ''}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              className={`w-40 px-2 py-1 rounded ${
                                theme === 'light'
                                  ? 'bg-white border border-sky-200'
                                  : 'bg-gray-600 border-gray-500'
                              }`}
                              placeholder="Phone"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.address || ''}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            className={`w-full px-2 py-1 rounded ${
                              theme === 'light'
                                ? 'bg-white border border-sky-200'
                                : 'bg-gray-600 border-gray-500'
                            }`}
                            placeholder="Address"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editForm.city || ''}
                              onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                              className={`w-24 px-2 py-1 rounded ${
                                theme === 'light'
                                  ? 'bg-white border border-sky-200'
                                  : 'bg-gray-600 border-gray-500'
                              }`}
                              placeholder="City"
                            />
                            <input
                              type="text"
                              value={editForm.country || ''}
                              onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                              className={`w-24 px-2 py-1 rounded ${
                                theme === 'light'
                                  ? 'bg-white border border-sky-200'
                                  : 'bg-gray-600 border-gray-500'
                              }`}
                              placeholder="Country"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.profil || ''}
                          onChange={(e) => setEditForm({ ...editForm, profil: e.target.value })}
                          className={`w-32 px-2 py-1 rounded ${
                            theme === 'light'
                              ? 'bg-white border border-sky-200'
                              : 'bg-gray-600 border-gray-500'
                          }`}
                          placeholder="Profile"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.status || ''}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className={`w-24 px-2 py-1 rounded ${
                            theme === 'light'
                              ? 'bg-white border border-sky-200'
                              : 'bg-gray-600 border-gray-500'
                          }`}
                          placeholder="Status"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editForm.invest || 0}
                          onChange={(e) => setEditForm({ ...editForm, invest: parseInt(e.target.value) })}
                          className={`w-24 px-2 py-1 rounded ${
                            theme === 'light'
                              ? 'bg-white border border-sky-200'
                              : 'bg-gray-600 border-gray-500'
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editForm.balance || 0}
                          onChange={(e) => setEditForm({ ...editForm, balance: parseInt(e.target.value) })}
                          className={`w-24 px-2 py-1 rounded ${
                            theme === 'light'
                              ? 'bg-white border border-sky-200'
                              : 'bg-gray-600 border-gray-500'
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className={`p-1 text-green-500 hover:text-green-600`}
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-500 hover:text-red-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <td className={`px-6 py-4 ${
                        theme === 'light' ? 'text-sky-900' : 'text-white'
                      }`}>
                        {user.fname} {user.lname}
                      </td>
                      <td className={`px-6 py-4 ${
                        theme === 'light' ? 'text-sky-900' : 'text-white'
                      }`}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{user.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${
                        theme === 'light' ? 'text-sky-900' : 'text-white'
                      }`}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{user.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe2 className="h-4 w-4" />
                            <span>{user.city}, {user.country}</span>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${
                        theme === 'light' ? 'text-sky-900' : 'text-white'
                      }`}>
                        {user.profil}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active'
                            ? theme === 'light'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-green-900 text-green-400'
                            : theme === 'light'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-red-900 text-red-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${
                        theme === 'light' ? 'text-sky-900' : 'text-white'
                      }`}>
                        ${user.invest?.toLocaleString() || 0}
                      </td>
                      <td className={`px-6 py-4 font-medium ${getBalanceColor(user.balance)}`}>
                        ${user.balance?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(user)}
                          className={`p-1 ${
                            theme === 'light'
                              ? 'text-sky-600 hover:text-sky-700'
                              : 'text-blue-400 hover:text-blue-300'
                          }`}
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}