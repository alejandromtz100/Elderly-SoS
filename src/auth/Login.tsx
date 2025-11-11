import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import aversiestesi from '../assets/aversiestesi.png';
import portada2 from '../assets/portada2.jpg';
import { saveUserOffline, getUserOffline } from '../db/indexedDB';

export const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contra, setContra] = useState('');
  const [recordarDisp, setRecordarDisp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://api-elderly.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contra, recordarDisp }),
      });

      if (!response.ok) throw new Error('Credenciales inválidas o error del servidor');
      const data = await response.json();

      // 🔹 Guardar en IndexedDB para login offline
      await saveUserOffline({
        usuario,
        contra,
        rol: data.rol,
        token: data.tokenPermanente || data.tempToken,
        _id: data._id,
      });

      // 🔹 Guardar también en localStorage
      if (data.tempToken) localStorage.setItem('tempToken', data.tempToken);
      if (data.tokenPermanente) localStorage.setItem('tokenPermanente', data.tokenPermanente);
      if (data._id) localStorage.setItem('userId', data._id);
      localStorage.setItem('usuario', usuario);

      // 🔹 Mostrar modal de éxito
      setShowSuccess(true);
      setIsLoading(false);

      setTimeout(() => {
        navigate(data.rol === 'admin' ? '/admin' : '/inicio');
        window.location.reload();
      }, 2000);

    } catch (err) {
      console.warn('⚠️ Sin conexión o error del servidor, intentando modo offline...');
      try {
        // 🔹 Intentar login offline
        const offlineUser = await getUserOffline(usuario);

        if (offlineUser && offlineUser.contra === contra) {
          localStorage.setItem('usuario', offlineUser.usuario);
          localStorage.setItem('tokenPermanente', offlineUser.token);
          setShowSuccess(true);
          setTimeout(() => navigate('/inicio'), 2000);
        } else {
          setError('No hay conexión y el usuario no se encontró en modo offline.');
        }
      } catch (dbError) {
        setError('Error al acceder al modo offline.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const goToRegister = () => navigate('/register', { state: { fromLogin: true } });

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-50 relative"
    >
      {/* Overlay de carga */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -180 }}
              animate={{
                scale: 1,
                rotate: 0,
                transition: {
                  rotate: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear',
                  },
                  scale: { duration: 0.5 },
                },
              }}
              className="w-24 h-24 rounded-full border-6 border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent flex items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                  transition: { repeat: Infinity, duration: 2 },
                }}
                className="w-20 h-20 rounded-full border-4 border-t-indigo-400 border-r-indigo-400 border-b-transparent border-l-transparent"
              />
            </motion.div>
            <motion.div className="absolute bottom-10 text-white text-lg font-medium">
              Cargando...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de éxito */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-xl"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.5 },
                  }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Inicio de sesión exitoso!</h3>
                <p className="text-indigo-100">Redirigiendo a tu panel...</p>
              </div>
              <div className="p-6 bg-gray-50">
                <div className="flex justify-center">
                  <motion.div
                    animate={{
                      width: ['0%', '100%'],
                      transition: { duration: 2, ease: 'linear' },
                    }}
                    className="h-1 bg-indigo-200 rounded-full"
                  >
                    <div className="h-full bg-indigo-500 rounded-full" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 relative"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 rounded-2xl z-10" />
          )}

          <div className="text-center mb-2">
            <div className="flex items-center justify-center mb-4">
              <img
                src={aversiestesi}
                alt="Logo"
                className="h-25 w-auto -mb-5"
                style={{ maxWidth: '140px' }}
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Bienvenido</h2>
            <p className="text-gray-600 mt-2">Inicia sesión para cuidar y conectar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="pl-3 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label htmlFor="contra" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="contra"
                name="contra"
                type="password"
                required
                value={contra}
                onChange={(e) => setContra(e.target.value)}
                className="pl-3 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  id="recordarDisp"
                  type="checkbox"
                  checked={recordarDisp}
                  onChange={(e) => setRecordarDisp(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2">Recordar dispositivo</span>
              </label>

              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-70"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              ¿No tienes una cuenta?{' '}
              <button onClick={goToRegister} className="font-medium text-indigo-600 hover:text-indigo-500">
                Regístrate ahora
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Imagen lateral */}
      <div className="hidden md:block md:w-1/2 relative">
        <img src={portada2} alt="Login Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-indigo-900 bg-opacity-70 flex items-center justify-center p-12">
          <div className="max-w-lg text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Conexión que cuida</h2>
            <p className="text-xl leading-relaxed mb-8">
              Creemos que el cuidado de nuestros seres queridos mayores debe ser tan sencillo como lleno de amor.
              Con Elderly, la distancia ya no es una barrera para brindar atención, tranquilidad y cariño.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
