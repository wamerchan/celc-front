import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  // Add a state for potential login errors
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }
    try {
      await login(email, password);
      // On successful login, the App component will automatically redirect
    } catch (err) {
      // The login function in AuthContext would need to throw an error for this to work
      setError('Credenciales inválidas. Por favor, intenta de nuevo.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Inicia sesión en tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sistema de Gestión CELC
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Correo Electrónico"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-coral bg-opacity-20 text-coral rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <Button type="submit" isLoading={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
