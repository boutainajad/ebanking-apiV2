import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, oauthLogin, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      toast.success('Connecté avec succès');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de connexion');
      toast.error('Échec de connexion');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Connexion</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6">
          <div className="text-center text-gray-500 mb-4">Ou</div>
          <div className="flex gap-4">
            <button
              onClick={() => oauthLogin('google')}
              className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Google
            </button>
            <button
              onClick={() => oauthLogin('github')}
              className="flex-1 bg-gray-800 text-white p-2 rounded hover:bg-gray-900"
            >
              GitHub
            </button>
          </div>
        </div>

        <p className="text-center mt-6">
          Pas de compte ? <Link to="/register" className="text-indigo-600">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}