import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';
import celcLogo from '../assets/celc-logo.png';
import bgCelc from '../assets/bg-celc.jpg';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!email || !password) {
      alert('Por favor ingresa email y contraseña');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      alert('Error: ' + message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Fondo con imagen de CELC - 20 de octubre de 2025 - WM Developer */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgCelc})` }}>
        {/* Overlay para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Tarjeta de login con diseño moderno */}
        <div className="bg-none overflow-hidden">
          {/* Header con logo/icono */}
          <div className="px-8 pt-8 pb-6 text-center">
            {/* Logo personalizado de CELC - 20 de octubre de 2025 - WM Developer */}
            <div className="mx-auto w-40 h-40 mb-4 flex items-center justify-center">
              <img src={celcLogo} alt="CELC Logo" className="w-full h-full" />
            </div>
            <p className="text-md font-semibold text-gray-50">Sistema para el Control de Equipos y Líneas de Comunicación</p>
          </div>

          {/* Formulario */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${email ? 'text-gray-800' : 'text-gray-500'}`}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              {/* Campo de contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${password ? 'text-gray-800' : 'text-gray-500'}`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Botón de login */}
              <button
                type="submit"
                disabled={loading}
                onClick={(e) => handleSubmit(e)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Iniciar Sesión
                  </div>
                )}
              </button>
            </form>

            {/* Información de prueba */}
            {import.meta.env.DEV && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 font-medium mb-1">Credenciales de prueba:</p>
                <p className="text-xs text-blue-700">Email: carlos.gomez0@example.com</p>
                <p className="text-xs text-blue-700">Contraseña: 123456</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer discreto */}
        <div className="text-center mt-6">
          <p className="text-sm text-white/80">
            Sistema de Gestión CELC - ADSO 3070123 <br />© 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
