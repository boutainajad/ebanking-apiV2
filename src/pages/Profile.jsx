import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function Profile() {
  const { user, fetchUser, updateProfile, changePassword, deleteAccount, loading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, email });
      toast.success('Profil mis à jour');
      setIsEditing(false);
    } catch (error) {
      toast.error('Échec de mise à jour');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await changePassword(passwords.current, passwords.new, passwords.confirm);
      toast.success('Mot de passe changé');
      setIsChangingPassword(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error('Échec du changement');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Supprimer votre compte ?')) {
      await deleteAccount();
      toast.success('Compte supprimé');
      navigate('/login');
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Mon Profil</h2>
      
      {isEditing ? (
        <form onSubmit={handleUpdate} className="mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Enregistrer</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Annuler</button>
          </div>
        </form>
      ) : (
        <div className="mb-6">
          <p><strong>Nom:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.provider && <p><strong>Connecté avec:</strong> {user.provider}</p>}
          <button onClick={() => setIsEditing(true)} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">Modifier profil</button>
        </div>
      )}

      {!user.provider && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Changer mot de passe</h3>
          {isChangingPassword ? (
            <form onSubmit={handlePassword}>
              <input
                type="password"
                placeholder="Mot de passe actuel"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full p-3 border rounded mb-4"
                required
              />
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full p-3 border rounded mb-4"
                required
              />
              <input
                type="password"
                placeholder="Confirmer"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full p-3 border rounded mb-4"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Changer</button>
                <button onClick={() => setIsChangingPassword(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Annuler</button>
              </div>
            </form>
          ) : (
            <button onClick={() => setIsChangingPassword(true)} className="bg-yellow-600 text-white px-4 py-2 rounded">Changer mot de passe</button>
          )}
        </div>
      )}

      <div className="border-t pt-4">
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Supprimer mon compte</button>
      </div>
    </div>
  );
}