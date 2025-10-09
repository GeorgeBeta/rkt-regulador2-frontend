import React, { useState } from 'react';
import { apiService } from '../services/api';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

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
      }
    } catch (error) {
      setMessage('Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <h2>Subir Pedido</h2>
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
  );
}