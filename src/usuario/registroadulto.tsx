import { useState } from 'react';
import axios from 'axios';
// ❗ Importar 'Variants' de framer-motion para tipar correctamente los objetos de animación
import { motion, AnimatePresence, Variants } from 'framer-motion'; 
import Navbar from '../componentes/Navbar';
import { saveAdultOffline } from '../db/offlineAdultsDB';
import { syncPendingAdults } from '../db/syncPendingAdults';

interface AdultoFormData {
  nombre: string;
  edad: number;
  lim_presion: number;
  lim_tiempo_cuarto: number;
  usuario: string;
}

// ----------------------------------------------------
// 🔵 Componente Spinner
// ----------------------------------------------------
const LoaderSpinner = () => (
  <motion.div
    className="w-12 h-12 border-4 border-t-4 border-t-white border-indigo-200 rounded-full"
    // Animación de rotación infinita
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  />
);
// ----------------------------------------------------

function RegistroAdulto() {
 
  const [formData, setFormData] = useState<AdultoFormData>({
    nombre: '',
    edad: 0,
    lim_presion: 0,
    lim_tiempo_cuarto: 0,
    usuario: localStorage.getItem('usuario') || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);
  const [isOnlineSubmission, setIsOnlineSubmission] = useState(false); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'nombre' || name === 'usuario' ? value : Number(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setSavedOffline(false);
    setIsOnlineSubmission(navigator.onLine); 

    try {
      if (!formData.nombre || !formData.edad || !formData.lim_presion || !formData.lim_tiempo_cuarto)
        throw new Error('Todos los campos son requeridos');

      if (formData.edad < 60)
        throw new Error('La edad debe ser mayor o igual a 60 años');

      // Simulación de carga (5s)
      setTimeout(async () => {
        try {
          if (!navigator.onLine) {
            // SIN INTERNET → Guardar offline
            await saveAdultOffline(formData);
            setSavedOffline(true);
            console.log("Adulto guardado offline");
          } else {
            // CON INTERNET → Envío normal
            const response = await axios.post(
              'https://api-elderly.onrender.com/api/registrar-adulto',
              formData
            );

            if (response.data.message) {
              setShowSuccess(true);
            }
          }

          // Limpiar formulario
          setFormData({
            nombre: '',
            edad: 0,
            lim_presion: 0,
            lim_tiempo_cuarto: 0,
            usuario: localStorage.getItem('usuario') || '',
          });

          // Cerrar modal
          setTimeout(() => setShowSuccess(false), 2000);

          // Intentar sincronizar si hay internet
          if (navigator.onLine) {
            syncPendingAdults();
          }

        } catch (err: any) {
          setError(err.response?.data?.message || err.message);
        } finally {
          setIsSubmitting(false);
          setIsOnlineSubmission(false); 
        }
      }, 5000);

    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
      setIsOnlineSubmission(false); 
    }
  };


  // ----------------------------------------------------
  // 🔵 Configuraciones de Animación (Ahora con tipado 'Variants')
  // ----------------------------------------------------

  // 1. Animación para el mensaje de guardado Offline (Rebote desde arriba)
  const offlineMessageVariants: Variants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 15 } },
    exit: { y: -50, opacity: 0 }
  };

  // 2. Animación para el Modal de Éxito (Rebote suave)
  const successModalVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
    exit: { scale: 0.8, opacity: 0 }
  };
  
  // 3. Animación para el Overlay de Carga 
  const loadingOverlayVariants: Variants = {
    initial: { opacity: 0 },
    exit: { opacity: 0 },
    
    // Variante para Carga ONLINE 
    online: {
      opacity: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', 
      transition: { duration: 0.3 }
    },
    
    // Variante para Carga OFFLINE 
    offline: {
      opacity: 1,
      backgroundColor: 'rgba(251, 191, 36, 0.4)',
      y: [10, 0], 
      transition: { 
        duration: 0.3,
        y: { type: "spring", stiffness: 400, damping: 30 }
      }
    }
  };

  // 4. Animación para el Texto en el Overlay de Carga
  const textVariants: Variants = {
    offline: { color: "#854D0E" }, 
    online: { color: "#E0E7FF" } 
  };


  // ----------------------------------------------------
  // 🔵 Renderizado del Componente
  // ----------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">

      <Navbar />

      {/* 🔵 Si se guardó offline (con animación) */}
      <AnimatePresence>
        {savedOffline && (
          <motion.div
            variants={offlineMessageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-4 bg-yellow-100 text-yellow-800 text-center font-semibold sticky top-0 z-40"
          >
            <span role="img" aria-label="wifi-off">🛜</span> Sin internet: el adulto se guardó para sincronizar más tarde.
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔵 Overlay de carga (con variantes online/offline) */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            variants={loadingOverlayVariants}
            initial="initial"
            animate={isOnlineSubmission ? 'online' : 'offline'}
            exit="exit"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
          >
            <LoaderSpinner />
            <motion.div
              className="text-lg mt-4 font-semibold"
              animate={isOnlineSubmission ? 'online' : 'offline'}
              variants={textVariants}
            >
              {isOnlineSubmission ? 'Registrando en línea...' : 'Guardando offline...'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔵 Modal de éxito */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={successModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm"
            >
              <h3 className="text-3xl font-extrabold text-green-600 mb-3">
                <span role="img" aria-label="check">✅</span> ¡Registro Exitoso!
              </h3>
              <p className="text-gray-700">El adulto se registró en el servidor correctamente.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TU FORMULARIO --- */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
         
          {/* ❗ Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nombre */}
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

            {/* Edad */}
            <input
              type="number"
              name="edad"
              min={60}
              placeholder="Edad (mínimo 60)"
              value={formData.edad || ''}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

            {/* Límite presión */}
            <input
              type="number"
              name="lim_presion"
              placeholder="Límite de presión"
              value={formData.lim_presion || ''}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

            {/* Tiempo cuarto */}
            <input
              type="number"
              name="lim_tiempo_cuarto"
              placeholder="Tiempo máximo en cuarto"
              value={formData.lim_tiempo_cuarto || ''}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

            {/* Usuario */}
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              readOnly
              className="w-full border p-3 bg-gray-100 rounded"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Registrar Adulto
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistroAdulto;