import React, { useState, useEffect } from 'react';
import axios from '../../service/axios.config';
import styles from './ModificarArticulo.module.css';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const ModificarArticulo = ({ articulo, onCancel, onUpdateSuccess }) => {
  const [error, setError] = useState(null);

  const validationSchema = Yup.object().shape({
    stockReal: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
    stockSeguridad: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
   // puntoPedido: Yup.number().required('Requerido').moreThan(0, 'Debe ser mayor a cero'),
    desviacionEstandar: Yup.number().required('Requerido').moreThan(0, 'Debe ser mayor a cero'),
    costoAlmacenamiento: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
    demandaAnual: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
    modeloElegido: Yup.string().required('Requerido'),
  });

  if (!articulo) return null; // Previene errores mientras carga

  const initialValues = {
    nombreArticulo: articulo.nombreArticulo || '',
    descripcion: articulo.descripcion || '',
    stockReal: articulo.stockReal ?? 0,
    stockSeguridad: articulo.stockSeguridad ?? 0,
   // puntoPedido: articulo.puntoPedido ?? 0,
    desviacionEstandar: articulo.desviacionEstandar ?? 0,
    costoAlmacenamiento: articulo.costoAlmacenamiento ?? 0,
    demandaAnual: articulo.demandaAnual ?? 0,
    modeloElegido: articulo.modeloElegido || '',
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalHeader}>Modificar Artículo {articulo.codigoArticulo}</h3>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await axios.put(`/articulos/${articulo.codigoArticulo}`, values);
              onUpdateSuccess();
            } catch (err) {
              console.error(err);
              setError('Error al modificar el artículo.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {[
                { label: 'Nombre', name: 'nombreArticulo', type: 'text' },
                { label: 'Descripción', name: 'descripcion', type: 'textarea' },
                { label: 'Stock Actual', name: 'stockReal', type: 'number' },
                { label: 'Stock de Seguridad', name: 'stockSeguridad', type: 'number' },
                //{ label: 'Punto de Pedido', name: 'puntoPedido', type: 'number' },
                { label: 'Desviación Estándar', name: 'desviacionEstandar', type: 'number', step: '0.01' },
                { label: 'Costo de Almacenamiento', name: 'costoAlmacenamiento', type: 'number', step: '0.01' },
                { label: 'Demanda Anual', name: 'demandaAnual', type: 'number' },
              ].map(({ label, name, type, step }) => (
                <div key={name} className={styles.formGroup}>
                  <label className={styles.formLabel}>{label}:</label>
                  {type === 'textarea' ? (
                    <Field
                      as="textarea"
                      name={name}
                      className={`${styles.formInput} ${styles.textarea}`}
                    />
                  ) : (
                    <Field
                      type={type}
                      name={name}
                      className={styles.formInput}
                      step={step}
                    />
                  )}
                  <ErrorMessage
                    name={name}
                    component="div"
                    className={styles.errorMessage}
                    style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}
                  />
                </div>
              ))}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Modelo Inventario:</label>
                <Field as="select" name="modeloElegido" className={styles.formInput}>
                  <option value="">Seleccione un modelo</option>
                  <option value="TIEMPO_FIJO">TIEMPO_FIJO</option>
                  <option value="LOTE_FIJO">LOTE_FIJO</option>
                </Field>
                <ErrorMessage
                  name="modeloElegido"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.submitButton}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className={`${styles.button} ${styles.cancelButton}`}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ModificarArticulo;
