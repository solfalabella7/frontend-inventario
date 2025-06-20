import React, { useState } from 'react';
import axios from '../../service/axios.config';

const EliminarArticulo = ({ codigoArticulo, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEliminar = async () => {
    if (!window.confirm(`¿Seguro que quieres eliminar el artículo ${codigoArticulo}?`)) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/articulos/${codigoArticulo}`);
      onDeleteSuccess();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el artículo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleEliminar} disabled={loading} title="Eliminar artículo">
        🗑️
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EliminarArticulo;

