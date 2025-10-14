import React from "react";

interface BackupTabProps {
  backupUrl: string;
  handleBackup: () => void;
}

const BackupTab: React.FC<BackupTabProps> = ({ backupUrl, handleBackup }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        <i className="fas fa-database mr-2 text-blue-500"></i>
        Gestión de Respaldos
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-file-export mr-2 text-blue-500"></i>
            Generar Respaldo
          </h3>
          <p className="text-gray-600 mb-6">
            Crea un respaldo completo de la base de datos del sistema. Este archivo contiene todos los datos 
            de usuarios, adultos mayores y configuraciones del sistema.
          </p>
          <button
            onClick={handleBackup}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center"
          >
            <i className="fas fa-download mr-2"></i>
            Generar Respaldo
          </button>
          {backupUrl && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
                <div>
                  <p className="font-medium text-green-800">Respaldo generado con éxito</p>
                  <a
                    href={backupUrl}
                    download="backup.zip"
                    className="text-blue-500 hover:underline text-sm inline-flex items-center mt-1"
                  >
                    <i className="fas fa-file-archive mr-1"></i>
                    Descargar archivo backup.zip
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-history mr-2 text-blue-500"></i>
            Historial de Respaldos
          </h3>
          <p className="text-gray-600 mb-4">
            Últimos respaldos generados del sistema:
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-file-archive text-gray-400 mr-3"></i>
                <div>
                  <p className="text-sm font-medium">backup_20230615.zip</p>
                  <p className="text-xs text-gray-500">15 Jun 2023, 03:00 AM</p>
                </div>
              </div>
              <button className="text-blue-500 hover:text-blue-700">
                <i className="fas fa-download"></i>
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-file-archive text-gray-400 mr-3"></i>
                <div>
                  <p className="text-sm font-medium">backup_20230608.zip</p>
                  <p className="text-xs text-gray-500">8 Jun 2023, 03:00 AM</p>
                </div>
              </div>
              <button className="text-blue-500 hover:text-blue-700">
                <i className="fas fa-download"></i>
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-file-archive text-gray-400 mr-3"></i>
                <div>
                  <p className="text-sm font-medium">backup_20230601.zip</p>
                  <p className="text-xs text-gray-500">1 Jun 2023, 03:00 AM</p>
                </div>
              </div>
              <button className="text-blue-500 hover:text-blue-700">
                <i className="fas fa-download"></i>
              </button>
            </div>
          </div>
          <button className="mt-4 text-sm text-blue-500 hover:text-blue-700 font-medium">
            <i className="fas fa-ellipsis-h mr-1"></i> Ver historial completo
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Recomendaciones de Respaldo
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-yellow-700">
          <li>Realiza respaldos periódicos (al menos semanales)</li>
          <li>Guarda los archivos de respaldo en un lugar seguro</li>
          <li>Verifica que los respaldos se puedan restaurar correctamente</li>
          <li>Considera configurar respaldos automáticos</li>
        </ul>
      </div>
    </div>
  );
};

export default BackupTab;