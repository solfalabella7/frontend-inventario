import React, { useState, useEffect } from 'react';
import axios from '../../service/axios.config';
import styles from './ModificarArticulo.module.css';
import * as Yup from 'yup'; 

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

const validationSchema = Yup.object().shape({
   stockReal: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
    stockSeguridad: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
    //precioUnitario:Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
     demoraEntrega:Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
     costoPedido:Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
     costoMantener:Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
    costoAlmacenamiento:Yup.number().required('Requerido').min(0, 'No puede ser negativo'),


});

  useEffect(() => {
    if (articulo) {
      console.log("Articulo recibido en ModificarArticulo:", articulo);
      setFormData({
      nombreArticulo: articulo.nombreArticulo || '',
      descripcion: articulo.descripcion || '',
      stockReal: articulo.stockReal ?? 0,
      stockSeguridad: articulo.stockSeguridad ?? 0,
      puntoPedido: articulo.puntoPedido ?? 0,
      desviacionEstandar: articulo.desviacionEstandar ?? 0,
      costoAlmacenamiento: articulo.costoAlmacenamiento ?? 0,
      demandaAnual: articulo.demandaAnual ?? 0,
      modeloElegido: articulo.modeloElegido || '',
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
            { label: 'Punto de Pedido', name: 'puntoPedido', type: 'number' },
            { label: 'Desviación Estándar', name: 'desviacionEstandar', type: 'number', step: '0.01' },
            { label: 'Costo de Almacenamiento', name: 'costoAlmacenamiento', type: 'number', step: '0.01' },
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
