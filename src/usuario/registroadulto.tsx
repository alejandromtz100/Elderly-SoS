import { useState } from 'react';

import axios from 'axios';

import {} from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';

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

        }

      }, 5000);



    } catch (err: any) {

      setError(err.message);

      setIsSubmitting(false);

    }

  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">



      <Navbar />



      {/* 🔵 Si se guardó offline */}

      {savedOffline && (

        <div className="p-4 bg-yellow-100 text-yellow-800 text-center font-semibold">

          Sin internet: el adulto se guardó para sincronizar más tarde.

        </div>

      )}



      {/* 🔵 Overlay de carga */}

      <AnimatePresence>

        {isSubmitting && (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"

          >

            <div className="text-white text-lg">Registrando...</div>

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

            <div className="bg-white p-6 rounded-xl shadow-xl text-center">

              <h3 className="text-2xl font-bold text-green-600 mb-2">

                ¡Adulto registrado!

              </h3>

              <p>El registro se completó exitosamente.</p>

            </div>

          </motion.div>

        )}

      </AnimatePresence>



      {/* --- TU FORMULARIO (SIN CAMBIOS VISUALES) --- */}

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

              className="w-full bg-indigo-600 text-white py-3 rounded-lg"

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