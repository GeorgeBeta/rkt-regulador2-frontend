import React, { useState, useEffect } from 'react';
import { apiService, type FilePDF } from '../services/api';

interface FilePDFListProps {
  onFileDeleted?: () => void;
  refreshTrigger?: number;
}

export default function FilePDFList({ onFileDeleted, refreshTrigger }: FilePDFListProps) {
  const [files, setFiles] = useState<FilePDF[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, [refreshTrigger]);

  const loadFiles = async () => {
    try {
      const data = await apiService.getFilePDFs();
      setFiles(data);
    } catch (error) {
      console.error('Error al cargar ficheros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filePDFId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este archivo?')) {
      return;
    }

    try {
      await apiService.deleteFilePDF(filePDFId);
      setFiles(files.filter(file => file.filePdfId !== filePDFId));
      if (onFileDeleted) {
        onFileDeleted();
      }
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      alert('Error al eliminar el archivo');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha';
    
    console.log('Fecha original:', dateString);
    
    // Intentar diferentes formatos
    let date = new Date(dateString);
    
    // Si es un timestamp en segundos (10 dígitos), convertir a milisegundos
    if (typeof dateString === 'string' && /^\d{10}$/.test(dateString)) {
      date = new Date(parseInt(dateString) * 1000);
    }
    // Si es un timestamp en milisegundos (13 dígitos)
    else if (typeof dateString === 'string' && /^\d{13}$/.test(dateString)) {
      date = new Date(parseInt(dateString));
    }
    
    if (isNaN(date.getTime())) {
      console.log('Fecha inválida:', dateString);
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES');
  };

  if (loading) return <div>Cargando ficheros...</div>;

  return (
    <div className="file-list">
      <h3>Ficheros Subidos</h3>
      {files.length === 0 ? (
        <p>No hay ficheros disponibles</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.filePdfId}>
                <td>{file.filePDFName}</td>
                <td>{formatDate(file.createdAt)}</td>
                <td>
                  <span className={`status ${file.completed ? 'completed' : 'pending'}`}>
                    {file.completed ? 'Completado' : 'Pendiente'}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleDelete(file.filePdfId)}
                    className="delete-btn"
                    title="Eliminar archivo"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}