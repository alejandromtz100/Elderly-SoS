import React, { useState, useEffect } from "react";
import { FaBell, FaCheck, FaTimes, FaSpinner, FaPaperPlane } from "react-icons/fa";

// Definición de tipos para las suscripciones
interface SubscriptionUser {
  _id: string;
  usuario: string;
  correo: string;
  suscrito: boolean;
  puedeRecibir: boolean;
  subscriptionToken: any; // El token de suscripción del navegador
}

const NotificationManagementTab: React.FC = () => {
  const [suscripciones, setSuscripciones] = useState<SubscriptionUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    targetUserId: "", // ID del usuario al que se enviará la notificación
  });
  const [isSending, setIsSending] = useState(false);

  const fetchSuscripciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://api-elderly.onrender.com/api/notificaciones/suscripciones"
      );
      if (!res.ok) {
        throw new Error("Error al obtener las suscripciones");
      }
      const data: SubscriptionUser[] = await res.json();
      setSuscripciones(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar suscripciones"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuscripciones();
  }, []);

  // Función para cambiar el permiso de recibir notificaciones (puedeRecibir)
  const togglePermiso = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(
        `https://api-elderly.onrender.com/api/notificaciones/suscripciones/${userId}/permitir`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ permitir: !currentStatus }),
        }
      );

      if (!res.ok) {
        throw new Error("Fallo al actualizar el permiso");
      }

      // Actualizar el estado local
      setSuscripciones((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, puedeRecibir: !currentStatus }
            : user
        )
      );
    } catch (err) {
      alert(
        "Error al cambiar el permiso: " +
          (err instanceof Error ? err.message : "Error desconocido")
      );
    }
  };

  // Función para enviar la notificación
  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notification.title || !notification.message || !notification.targetUserId) {
      alert("Por favor, completa todos los campos de la notificación.");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch(
        `https://api-elderly.onrender.com/api/notificaciones/notificar/${notification.targetUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: notification.title,
            mensaje: notification.message,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Notificación enviada con éxito a: " + notification.targetUserId);
        setNotification({ title: "", message: "", targetUserId: "" });
      } else {
        throw new Error(data.msg || "Error al enviar la notificación.");
      }
    } catch (err) {
      alert(
        "Error al enviar la notificación: " +
          (err instanceof Error ? err.message : "Error desconocido")
      );
    } finally {
      setIsSending(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        <FaSpinner className="animate-spin inline mr-2" /> Cargando suscripciones...
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Error al cargar: {error}
      </div>
    );

  const usuariosNotificables = suscripciones.filter(
    (u) => u.subscriptionToken && u.puedeRecibir
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaBell className="mr-3 text-yellow-600" /> Gestión de Notificaciones Push
      </h2>

      {/* Tarjeta para enviar notificación */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
          <FaPaperPlane className="mr-2" /> Enviar Notificación de Prueba
        </h3>
        <form onSubmit={sendNotification} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Usuario a Notificar:
            </label>
            <select
              required
              value={notification.targetUserId}
              onChange={(e) =>
                setNotification({ ...notification, targetUserId: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Selecciona un usuario (Suscrito y Permitido)</option>
              {usuariosNotificables.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.usuario} ({user.correo})
                </option>
              ))}
            </select>
            {!usuariosNotificables.length && (
              <p className="text-sm text-red-500 mt-1">No hay usuarios activos que puedan recibir notificaciones.</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Título:</label>
            <input
              type="text"
              required
              value={notification.title}
              onChange={(e) =>
                setNotification({ ...notification, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              placeholder="Título de la notificación"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mensaje:</label>
            <textarea
              required
              value={notification.message}
              onChange={(e) =>
                setNotification({ ...notification, message: e.target.value })
              }
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              placeholder="Cuerpo del mensaje (máx. 256 caracteres)"
              maxLength={256}
            />
          </div>
          <button
            type="submit"
            disabled={isSending || !usuariosNotificables.length}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSending ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Enviando...
              </>
            ) : (
              <>
                <FaPaperPlane className="mr-2" /> Enviar Notificación
              </>
            )}
          </button>
        </form>
      </div>

      {/* Tabla de Suscripciones */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Usuarios Suscritos ({suscripciones.length})
      </h3>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permiso Admin
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suscripciones.map((user) => (
              <tr key={user._id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.usuario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.correo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {user.subscriptionToken ? (
                    <FaCheck className="text-green-500 mx-auto" title="Token Guardado" />
                  ) : (
                    <FaTimes className="text-red-500 mx-auto" title="Token Faltante" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.puedeRecibir
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.puedeRecibir ? "Permitido" : "Denegado"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => togglePermiso(user._id, user.puedeRecibir)}
                    disabled={!user.subscriptionToken}
                    className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
                      user.puedeRecibir
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    } disabled:bg-gray-300 disabled:cursor-not-allowed`}
                  >
                    {user.puedeRecibir ? "Denegar" : "Permitir"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationManagementTab;