import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icono personalizado para evitar error al compilar
const customIcon: Icon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38], // centra la base del ícono en la ubicación
});

const Mapa = () => {
  const [ubicacion, setUbicacion] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacion([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        setError('No se pudo obtener tu ubicación. Por favor activa el GPS.');
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-6">
      <motion.h1
        className="text-4xl font-bold text-blue-800 text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🌍 Localización
      </motion.h1>

      <p className="text-center text-gray-600 mb-8">
        Te mostramos la ubicacion de tu familiar
      </p>

      {ubicacion ? (
        <div className="max-w-4xl mx-auto h-[500px] rounded-xl overflow-hidden shadow-lg">
          <MapContainer center={ubicacion} zoom={15} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={ubicacion} icon={customIcon}>
              <Popup>📍 Tu faamiliar esta aqui</Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <p className="text-center text-gray-500">Obteniendo tu ubicación...</p>
      )}
    </div>
  );
};

export default Mapa;
