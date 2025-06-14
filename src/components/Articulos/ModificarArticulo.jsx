import React, { useState, useEffect } from 'react';
import axios from '../../service/axios.config';
import styles from './ModificarArticulo.module.css';

const ModificarArticulo = ({ articulo, onCancel, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    nombreArticulo: '',
    descripcion: '',
    stockReal: '',
    stockSeguridad: 0,
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
        nombreArticulo: articulo.nombreArticulo || '',
        descripcion: articulo.descripcion || '',
        stockReal: articulo.stockReal,
        stockSeguridad: articulo.stockSeguridad?.toString() || '',
        precioUnitario: articulo.precioUnitario ?? 0,
        demoraEntrega: articulo.demoraEntrega ?? 0,
        costoPedido: articulo.costoPedido ?? 0,
        costoMantener: articulo.costoMantener ?? 0,
        costoAlmacenamiento: articulo.costoAlmacenamiento ?? 0,
        loteOptimo: articulo.loteOptimo ?? 0,
        inventarioMax: articulo.inventarioMax ?? 0,
        modeloElegido: articulo.modeloElegido || '',
        demandaAnual: articulo.demandaAnual ?? 0,
      });
    }
  }, [articulo]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        value === ''  // Si está vacío, guardo vacío para que no ponga 0
          ? ''
          : isNaN(value) || name === 'nombreArticulo' || name === 'descripcion' || name === 'modeloElegido'
            ? value
            : Number(value),
    }));
  };

    console.log("Enviando PUT para:", articulo);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!articulo?.codigoArticulo) {
        throw new Error('Falta el código del artículo');
      }

      console.log("Datos enviados al backend:", formData);
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
          {[
            { label: 'Nombre', name: 'nombreArticulo', type: 'text' },
            { label: 'Descripción', name: 'descripcion', type: 'textarea' },
            { label: 'Stock Actual', name: 'stockReal', type: 'number' },
            { label: 'Stock de Seguridad', name: 'stockSeguridad', type: 'number' },
            //{ label: 'Precio Unitario', name: 'precioUnitario', type: 'number', step: '0.01' },
           // { label: 'Demora de Entrega (días)', name: 'demoraEntrega', type: 'number' },
            //{ label: 'Costo de Pedido', name: 'costoPedido', type: 'number', step: '0.01' },
          //  { label: 'Costo de Mantener', name: 'costoMantener', type: 'number', step: '0.01' },
            { label: 'Costo de Almacenamiento', name: 'costoAlmacenamiento', type: 'number', step: '0.01' },
           // { label: 'Lote Óptimo', name: 'loteOptimo', type: 'number' },
           // { label: 'Inventario Máximo', name: 'inventarioMax', type: 'number' },
            { label: 'Demanda Anual', name: 'demandaAnual', type: 'number' }
          ].map(({ label, name, type, step }) => (
            <div key={name} className={styles.formGroup}>
              <label className={styles.formLabel}>{label}:</label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`${styles.formInput} ${styles.textarea}`}
                  required
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={styles.formInput}
                  min={0}
                  step={step}
                  required
                />
              )}
            </div>
          ))}

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

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div style={{ display: 'flex', gap: '16px' }}>
            <button type="submit" className={`${styles.button} ${styles.submitButton}`} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button type="button" onClick={onCancel} className={`${styles.button} ${styles.cancelButton}`} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModificarArticulo;
