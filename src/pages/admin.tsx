import React, { useState, useEffect } from "react";
import Navbar from "../componentes/NavAdmin";
import DashboardTab from "../components/DashboardTab";
import DataManagementTab from "../components/DataManagementTab";
import BackupTab from "../components/BackupTab";


const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [adultos, setAdultos] = useState<any[]>([]);
  const [backupUrl, setBackupUrl] = useState<string>("");
  const [loading, setLoading] = useState({
    dashboard: true,
    usuarios: true,
    adultos: true
  });

  // Obtener datos del panel de control
  useEffect(() => {
    setLoading(prev => ({ ...prev, dashboard: true }));
    fetch("https://api-elderly.onrender.com/api/panel-control")
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(prev => ({ ...prev, dashboard: false }));
      })
      .catch((err) => {
        console.error(err);
        setLoading(prev => ({ ...prev, dashboard: false }));
      });
  }, []);

  // Obtener lista de usuarios
  useEffect(() => {
    setLoading(prev => ({ ...prev, usuarios: true }));
    fetch("https://api-elderly.onrender.com/api/usuarios")
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data.usuarios);
        setLoading(prev => ({ ...prev, usuarios: false }));
      })
      .catch((err) => {
        console.error(err);
        setLoading(prev => ({ ...prev, usuarios: false }));
      });
  }, []);

  // Obtener lista de adultos
  useEffect(() => {
    setLoading(prev => ({ ...prev, adultos: true }));
    fetch("https://api-elderly.onrender.com/api/adultos")
      .then((res) => res.json())
      .then((data) => {
        setAdultos(data.data);
        setLoading(prev => ({ ...prev, adultos: false }));
      })
      .catch((err) => {
        console.error(err);
        setLoading(prev => ({ ...prev, adultos: false }));
      });
  }, []);

  // Función para generar respaldo
  const handleBackup = () => {
    fetch("https://api-elderly.onrender.com/api/backup")
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        setBackupUrl(url);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="p-6 pt-24 max-w-7xl mx-auto">
        {/* Pestañas de navegación */}
        <div className="mb-8">
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
                activeTab === "dashboard"
                  ? "bg-white text-blue-600 border-t border-l border-r border-gray-200 shadow-sm"
                  : "text-gray-500 hover:text-blue-500 hover:bg-gray-100"
              }`}
            >
              <i className="fas fa-tachometer-alt mr-2"></i>
              Panel de Control
            </button>

            <button
              onClick={() => setActiveTab("crud")}
              className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
                activeTab === "crud"
                  ? "bg-white text-blue-600 border-t border-l border-r border-gray-200 shadow-sm"
                  : "text-gray-500 hover:text-blue-500 hover:bg-gray-100"
              }`}
            >
              <i className="fas fa-users-cog mr-2"></i>
              Gestión de Datos
            </button>

            <button
              onClick={() => setActiveTab("backup")}
              className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
                activeTab === "backup"
                  ? "bg-white text-blue-600 border-t border-l border-r border-gray-200 shadow-sm"
                  : "text-gray-500 hover:text-blue-500 hover:bg-gray-100"
              }`}
            >
              <i className="fas fa-database mr-2"></i>
              Respaldos
            </button>

            <button
              onClick={() => setActiveTab("graficas")}
              className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
                activeTab === "graficas"
                  ? "bg-white text-blue-600 border-t border-l border-r border-gray-200 shadow-sm"
                  : "text-gray-500 hover:text-blue-500 hover:bg-gray-100"
              }`}
            >
              <i className="fas fa-chart-bar mr-2"></i>
              Gráficas
            </button>
          </div>
        </div>

        {/* Contenido de cada sección */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {activeTab === "dashboard" && (
            <DashboardTab
              loading={loading.dashboard}
              dashboardData={dashboardData}
              adultos={adultos}
            />
          )}

          {activeTab === "crud" && (
            <DataManagementTab
              loadingUsuarios={loading.usuarios}
              loadingAdultos={loading.adultos}
              usuarios={usuarios}
              adultos={adultos}
            />
          )}

          {activeTab === "backup" && (
            <BackupTab backupUrl={backupUrl} handleBackup={handleBackup} />
          )}

         
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
