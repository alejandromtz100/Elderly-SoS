import { useEffect, useState } from 'react';
import Navbar from '../componentes/Navbar'; 

interface Recordatorio {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
}

const Recordatorios = () => {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    const guardados = localStorage.getItem('recordatorios');
    if (guardados) {
      setRecordatorios(JSON.parse(guardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
  }, [recordatorios]);

  const agregarRecordatorio = () => {
    if (!titulo || !fecha) {
      alert('Por favor completa el título y la fecha');
      return;
    }

    const nuevo: Recordatorio = {
      id: Date.now(),
      titulo,
      descripcion,
      fecha,
    };

    setRecordatorios([nuevo, ...recordatorios]);
    setTitulo('');
    setDescripcion('');
    setFecha('');
  };

  const eliminarRecordatorio = (id: number) => {
    const actualizados = recordatorios.filter((r) => r.id !== id);
    setRecordatorios(actualizados);
  };

  return (
    <>
      <Navbar /> 
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-blue-700 mb-6">📆 Mis Recordatorios</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Título del recordatorio"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <input
              type="datetime-local"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />

            <textarea
              className="md:col-span-2 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Descripción (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={agregarRecordatorio}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Lista de recordatorios */}
        <div className="space-y-4">
          {recordatorios.length === 0 ? (
            <p className="text-gray-500">No tienes recordatorios por ahora.</p>
          ) : (
            recordatorios.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-800">{r.titulo}</h3>
                  <button
                    onClick={() => eliminarRecordatorio(r.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
                {r.descripcion && (
                  <p className="text-gray-600 text-sm mb-1">{r.descripcion}</p>
                )}
                <p className="text-blue-600 text-sm">
                  📅 {new Date(r.fecha).toLocaleString('es-MX', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Recordatorios;
