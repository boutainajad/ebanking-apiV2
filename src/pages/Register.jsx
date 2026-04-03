import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: 'Les mots de passe ne correspondent pas' });
      return;
    }
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      toast.success('Compte créé avec succès!');
      navigate('/login');
    } catch (err) {
      setErrors(err.response?.data?.errors || { general: 'Échec d\'inscription' });
      toast.error('Échec d\'inscription');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Inscription</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom complet"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border rounded mb-4"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}
          
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border rounded mb-4"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
          
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 border rounded mb-4"
            required
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}
          
          <input
            type="password"
            placeholder="Confirmer mot de passe"
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            className="w-full p-3 border rounded mb-4"
            required
          />
          {errors.password_confirmation && <p className="text-red-500 text-sm mb-2">{errors.password_confirmation}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Création...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="text-center mt-6">
          Déjà un compte ? <Link to="/login" className="text-indigo-600">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}