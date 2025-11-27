import axios from 'axios';
import { getPendingAdults, deletePendingAdult } from './offlineAdultsDB';

export async function syncPendingAdults() {
  const pendientes = await getPendingAdults();

  for (const adulto of pendientes) {
    try {
      await axios.post(
        'https://api-elderly.onrender.com/api/registrar-adulto',
        {
          nombre: adulto.nombre,
          edad: adulto.edad,
          lim_presion: adulto.lim_presion,
          lim_tiempo_cuarto: adulto.lim_tiempo_cuarto,
          usuario: adulto.usuario
        }
      );

      await deletePendingAdult(adulto.id);

      console.log("Adulto sincronizado:", adulto.nombre);
    } catch (error) {
      console.error("Error al sincronizar:", error);
    }
  }
}
