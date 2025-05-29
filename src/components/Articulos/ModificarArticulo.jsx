import React, { useState, useEffect } from 'react';
import axios from '../../service/axios.config';
import styles from './ModificarArticulo.module.css';

const ModificarArticulo = ({ articulo, onCancel, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    nombreArticulo: '',
    descripcion: '',
    stockActualArticulo: 0,
    stockSeguridadArticulo: 0,
    precioUnitario: 0,

    demoraEntrega: 0,
    costoPedido: 0,
    costoMantener: 0,
    costoAlmacenamiento: 0,
    loteOptimo: 0,
    inventarioMax: 0,
    modeloElegido: '',
    demandaAnual: 0,
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

        precioUnitario: articulo.precioUnitario,
        demoraEntrega: articulo.demoraEntrega,
        costoPedido: articulo.costoPedido,
        costoMantener: articulo.costoMantener,
        costoAlmacenamiento: articulo.costoAlmacenamiento,
        loteOptimo: articulo.loteOptimo,
        inventarioMax: articulo.inventarioMax,
        modeloElegido: articulo.modeloElegido,
        demandaAnual: articulo.demandaAnual,
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

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Precio Unitario:</label>
            <input
              type="number"
              name="precioUnitario"
              value={formData.precioUnitario}
              onChange={handleChange}
              className={styles.formInput}
              min={0}
              step="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Demora de Entrega (días):</label>
            <input
              type="number"
              name="demoraEntrega"
              value={formData.demoraEntrega}
              onChange={handleChange}
              className={styles.formInput}
              min={0}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Costo de Pedido:</label>
            <input
              type="number"
              name="costoPedido"
              value={formData.costoPedido}
              onChange={handleChange}
              className={styles.formInput}
              min={0}
              step="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Costo de Mantener:</label>
            <input
              type="number"
              name="costoMantener"
              value={formData.costoMantener}
              onChange={handleChange}
              className={styles.formInput}
              min={0}
              step="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Costo de Almacenamiento:</label>
            <input
              type="number"
              name="costoAlmacenamiento"
              value={formData.costoAlmacenamiento}
              onChange={handleChange}
              className={styles.formInput}
              min={0}
              step="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Lote Óptimo:</label>
            <input
              type="number"
              name="loteOptimo"
              value={formData.loteOptimo}
              onChange={handleChange}
              className={styles.formInput}
              min={1}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Inventario Máximo:</label>
            <input
              type="number"
              name="inventarioMax"
              value={formData.inventarioMax}
              onChange={handleChange}
              className={styles.formInput}
              min={1}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modeloElegido" className={styles.formLabel}>Modelo Inventario:</label>
            <select
              id="modeloElegido"
              name="modeloElegido"
              value={formData.modeloElegido}
              onChange={handleChange}
              className={styles.formInput}
              required
            >
              <option value="">Seleccione un modelo</option>
              <option value="TIEMPO_FIJO">TIEMPO_FIJO</option>
              <option value="LOTE_FIJO">LOTE_FIJO</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Demanda Anual:</label>
            <input
              type="number"
              name="demandaAnual"
              value={formData.demandaAnual}
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
