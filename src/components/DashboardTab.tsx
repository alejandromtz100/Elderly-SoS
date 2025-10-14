import React from "react";
import StatsCard from "./StatsCard";

interface DashboardTabProps {
  loading: boolean;
  dashboardData: any;
  adultos: any[];
}

const DashboardTab: React.FC<DashboardTabProps> = ({ loading, dashboardData, adultos }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-tachometer-alt mr-2 text-blue-500"></i>
          Panel de Control
        </h2>
        <span className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString()}
        </span>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : dashboardData ? (
        <>
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon="users"
              title="Total Usuarios"
              value={dashboardData.totalUsuarios}
              description="Registrados en el sistema"
              color="blue"
            />
            
            <StatsCard
              icon="user-friends"
              title="Adultos Registrados"
              value={adultos.length}
              description="En seguimiento actual"
              color="green"
            />
            
            <StatsCard
              icon="user-tag"
              title="Roles Activos"
              value={dashboardData.roles?.length || 0}
              description="Tipos de usuarios"
              color="purple"
            />
          </div>
          
          {/* Detalle de roles */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-chart-pie mr-2 text-blue-500"></i>
              Distribución de Roles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardData.roles?.map((role: any) => (
                <div key={role._id} className="bg-white p-4 rounded-lg shadow-xs border border-gray-100">
                  <p className="font-medium text-gray-700 capitalize">{role._id}</p>
                  <p className="text-2xl font-bold text-gray-800">{role.count}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(role.count / dashboardData.totalUsuarios) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Resumen rápido */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                Resumen del Sistema
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Versión de la aplicación</span>
                  <span className="font-medium">1.0.0</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Último respaldo</span>
                  <span className="font-medium">Hace 2 días</span>
                </li>
                <li className="flex justify-between py-2">
                  <span className="text-gray-600">Estado del servidor</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Activo
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <i className="fas fa-bell mr-2 text-blue-500"></i>
                Actividad Reciente
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-50 rounded-full mr-3">
                    <i className="fas fa-user-plus text-blue-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nuevo usuario registrado</p>
                    <p className="text-xs text-gray-500">Hace 30 minutos</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-green-50 rounded-full mr-3">
                    <i className="fas fa-heartbeat text-green-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alerta de presión arterial</p>
                    <p className="text-xs text-gray-500">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-purple-50 rounded-full mr-3">
                    <i className="fas fa-database text-purple-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Respaldo automático completado</p>
                    <p className="text-xs text-gray-500">Ayer a las 3:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <i className="fas fa-exclamation-triangle text-3xl text-yellow-500 mb-4"></i>
          <p className="text-gray-600">No se pudieron cargar los datos del panel</p>
        </div>
      )}
    </div>
  );
};

export default DashboardTab;