import React, { useState, useEffect } from 'react';
import { apiService, type Pedido } from '../services/api';

export default function PedidosList() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const data = await apiService.getPedidos();
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando pedidos...</div>;

  return (
    <div className="pedidos-list">
      <h2>Lista de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos disponibles</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Archivo</th>
              <th>Fecha de Subida</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.filename}</td>
                <td>{pedido.uploadDate}</td>
                <td className={`status ${pedido.status.toLowerCase()}`}>
                  {pedido.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}