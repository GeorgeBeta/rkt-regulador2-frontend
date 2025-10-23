import React, { useState } from 'react';
import { apiService } from '../services/api';
import FilePDFList from './FilePDFList';

interface FileUploadProps {
  onFileUploaded?: () => void;
}

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('Por favor selecciona un archivo PDF válido');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const result = await apiService.uploadPedido(file);
      setMessage(result.message);
      if (result.success) {
        setFile(null);
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        setRefreshTrigger(prev => prev + 1);
        if (onFileUploaded) {
          onFileUploaded();
        }
      }
    } catch (error) {
      setMessage('Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-management">
      <h2>Gestionar Ficheros</h2>
      <div className="file-management-container">
        <div className="upload-section">
          <h3>Subir Fichero</h3>
          <div className="upload-area">
            <input
              type="file"
              id="file-input"
              accept=".pdf"
              onChange={handleFileChange}
            />
            {file && (
              <div className="file-info">
                <p>Archivo seleccionado: {file.name}</p>
                <button onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Subiendo...' : 'Subir Pedido'}
                </button>
              </div>
            )}
            {message && <div className={message.includes('Error') ? 'error' : 'success'}>{message}</div>}
          </div>
        </div>
        <div className="list-section">
          <FilePDFList onFileDeleted={onFileUploaded} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}