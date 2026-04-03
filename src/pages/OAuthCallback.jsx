import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function OAuthCallback() {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuth } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && provider) {
      handleOAuth(provider, code)
        .then(() => {
          toast.success('Authentification réussie');
          navigate('/profile');
        })
        .catch(() => {
          toast.error('Authentification échouée');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4">Authentification en cours...</p>
      </div>
    </div>
  );
}