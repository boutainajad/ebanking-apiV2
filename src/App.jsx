import { useState, useEffect } from 'react';

// Composant Login
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Utilisateur', email, provider: null }));
      onLogin();
    } else {
      setError('Email et mot de passe requis');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            required
          />
          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Se connecter
          </button>
        </form>
       
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Pas de compte ? <a href="/register" style={{ color: '#4f46e5' }}>S'inscrire</a>
        </p>
      </div>
    </div>
  );
}

function Register({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.name && form.email && form.password) {
      localStorage.setItem('user', JSON.stringify({ name: form.name, email: form.email, provider: null }));
      onRegister();
    } else {
      setError('Tous les champs sont requis');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom complet"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            required
          />
          <input
            type="password"
            placeholder="Confirmer mot de passe"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            required
          />
          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            S'inscrire
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Déjà un compte ? <a href="/login" style={{ color: '#4f46e5' }}>Se connecter</a>
        </p>
      </div>
    </div>
  );
}

function Profile({ onLogout }) {
  const [user, setUser] = useState({ name: '', email: '', provider: null });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setEditForm({ name: userData.name, email: userData.email });
    }
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name: editForm.name, email: editForm.email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    showMessage('Profil mis à jour avec succès!', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      showMessage('Les nouveaux mots de passe ne correspondent pas', 'error');
      return;
    }
    if (passwordForm.new.length < 6) {
      showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }
    // Simulation de changement
    showMessage('Mot de passe changé avec succès!', 'success');
    setIsChangingPassword(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    showMessage('Compte supprimé avec succès', 'success');
  };

  const isOAuthAccount = user.provider !== null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f3f4f6' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Message de notification */}
        {message.text && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
          }}>
            {message.text}
          </div>
        )}

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Mon Profil</h2>
            <button onClick={onLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Déconnexion
            </button>
          </div>

          {/* Informations du profil */}
          {!isEditing ? (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#4b5563' }}>Nom complet</label>
                <p style={{ padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>{user.name}</p>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#4b5563' }}>Email</label>
                <p style={{ padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>{user.email}</p>
              </div>
              {isOAuthAccount && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#4b5563' }}>Connecté avec</label>
                  <p style={{ padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>{user.provider}</p>
                </div>
              )}
              <button onClick={() => setIsEditing(true)} style={{ padding: '0.5rem 1rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '1rem' }}>
                Modifier le profil
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#4b5563' }}>Nom complet</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#4b5563' }}>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Enregistrer
                </button>
                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>

        {!isOAuthAccount && (
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Changer le mot de passe</h3>
            {!isChangingPassword ? (
              <button onClick={() => setIsChangingPassword(true)} style={{ padding: '0.5rem 1rem', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Changer mon mot de passe
              </button>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="password"
                    placeholder="Mot de passe actuel"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="password"
                    placeholder="Confirmer le nouveau mot de passe"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Changer
                  </button>
                  <button type="button" onClick={() => setIsChangingPassword(false)} style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

 
        {showDeleteModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Confirmation</h3>
              <p style={{ marginBottom: '1.5rem' }}>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={handleDeleteAccount} style={{ padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Oui, supprimer
                </button>
                <button onClick={() => setShowDeleteModal(false)} style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const path = window.location.pathname;

  if (isAuthenticated) {
    if (path === '/profile') {
      return <Profile onLogout={handleLogout} />;
    }
    window.location.href = '/profile';
    return null;
  } else {
    if (path === '/register') {
      return <Register onRegister={handleLogin} />;
    }
    return <Login onLogin={handleLogin} />;
  }
}

export default App;