import React, { useState, useEffect } from 'react';
import axios from '../../service/axios.config';
import styles from './ModificarArticulo.module.css';

const ModificarArticulo = ({ articulo, onCancel, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    nombreArticulo: '',
    descripcion: '',
    stockActualArticulo: 0,
    stockSeguridadArticulo: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (articulo) {
      setFormData({
        nombreArticulo: articulo.nombreArticulo,
        descripcion: articulo.descripcion,
        stockActualArticulo: articulo.stockActualArticulo,
        stockSeguridadArticulo: articulo.stockSeguridadArticulo,
      });
    }
  }, [articulo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('stock') ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.put(`/articulos/${articulo.codigoArticulo}`, formData);
      onUpdateSuccess();
    } catch (err) {
      console.error(err);
      setError('Error al modificar el artículo.');
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalHeader}>Modificar Artículo {articulo.codigoArticulo}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nombre:</label>
            <input
              type="text"
              name="nombreArticulo"
              value={formData.nombreArticulo}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={`${styles.formInput} ${styles.textarea}`}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Stock Actual:</label>
            <input
              type="number"
              name="stockActualArticulo"
              value={formData.stockActualArticulo}
              onChange={handleChange}
              className={styles.formInput}
              min={0}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Stock de Seguridad:</label>
            <input
              type="number"
              name="stockSeguridadArticulo"
              value={formData.stockSeguridadArticulo}
              onChange={handleChange}
              className={styles.formInput}
              min={0}
              required
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={`${styles.button} ${styles.submitButton}`}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              className={`${styles.button} ${styles.cancelButton}`}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default ModificarArticulo;
