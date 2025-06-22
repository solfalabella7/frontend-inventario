import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form as FormBs, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const CreateProveedor = ({ onSuccess }) => {
  const [articulos, setArticulos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [currentAsociacion, setCurrentAsociacion] = useState({
    codigoArticulo: '',
    precioUnitProveedorArticulo: '',
    demoraEntrega: '',
    nivelDeServicio: '',
    costoPedido: '',
    costoMantenimiento: '',
    loteOptimo: '',
    periodoRevision: '',
    inventarioMaximo: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [asociacionErrors, setAsociacionErrors] = useState({});

  useEffect(() => {
    const cargarArticulos = async () => {
      try {
        const response = await api.get('/articulos');
        setArticulos(response.data);
      } catch (err) {
        console.error('Error cargando artículos:', err);
        setError('No se pudieron cargar los artículos disponibles');
      }
    };
    cargarArticulos();
  }, []);

  const initialValues = {
    nombreProveedor: '',
  };

  const validationSchema = Yup.object().shape({
    nombreProveedor: Yup.string()
      .min(2, 'Nombre demasiado corto (mínimo 2 caracteres)')
      .max(50, 'Nombre demasiado largo (máximo 50 caracteres)')
      .required('El nombre es obligatorio'),
  });

  const asociacionSchema = Yup.object().shape({
    codigoArticulo: Yup.number().required('Debe seleccionar un artículo'),
    precioUnitProveedorArticulo: Yup.number()
      .min(0, 'El precio no puede ser negativo')
      .required('Requerido'),
    demoraEntrega: Yup.number()
      .min(0, 'La demora no puede ser negativa')
      .required('Requerido'),
    nivelDeServicio: Yup.number()
      .min(0, 'El nivel no puede ser negativo')
      .max(100, 'El nivel no puede superar 100')
      .required('Requerido'),
    costoPedido: Yup.number()
      .min(0, 'El costo no puede ser negativo')
      .required('Requerido'),
    costoMantenimiento: Yup.number()
      .min(0, 'El mantenimiento no puede ser negativo')
      .required('Requerido'),
    loteOptimo: Yup.number()
      .min(0, 'El lote no puede ser negativo')
      .required('Requerido'),
    periodoRevision: Yup.number()
      .min(0, 'El período no puede ser negativo')
      .nullable(),
    inventarioMaximo: Yup.number()
      .min(0, 'El inventario no puede ser negativo')
      .nullable(),
  });

  // Convertimos ambos a string para asegurar que la comparación funcione
  const articuloSeleccionado = articulos.find(
    a => String(a.codigoArticulo) === String(currentAsociacion.codigoArticulo)
  );


  const handleAddAsociacion = () => {
    const errors = {};

    if (!currentAsociacion.codigoArticulo) {
      errors.codigoArticulo = 'Debe seleccionar un artículo';
    }
    if (currentAsociacion.precioUnitProveedorArticulo < 0) {
      errors.precioUnitProveedorArticulo = 'El precio no puede ser negativo';
    }
    if (currentAsociacion.costoPedido < 0) {
      errors.costoPedido = 'El costo de pedido no puede ser negativo';
    }
    if (currentAsociacion.costoMantenimiento < 0) {
      errors.costoMantenimiento = 'El mantenimiento no puede ser negativo';
    }
    if (currentAsociacion.loteOptimo < 0) {
      errors.loteOptimo = 'El lote no puede ser negativo';
    }
    if (currentAsociacion.nivelDeServicio < 0) {
      errors.nivelDeServicio = 'El nivel de servicio no puede ser negativo';
    }
    if (currentAsociacion.demoraEntrega < 0) {
      errors.demoraEntrega = 'La demora no puede ser negativa';
    }
    if (currentAsociacion.periodoRevision < 0) {
      errors.periodoRevision = 'El período no puede ser negativo';
    }
    if (currentAsociacion.inventarioMaximo < 0) {
      errors.inventarioMaximo = 'El inventario máximo no puede ser negativo';
    }

    if (Object.keys(errors).length > 0) {
      setAsociacionErrors(errors);
      return;
    }

    // Si no hay errores, agregar artículo y limpiar
    setAsociaciones([...asociaciones, currentAsociacion]);
    setCurrentAsociacion({
      codigoArticulo: '',
      precioUnitProveedorArticulo: '',
      demoraEntrega: '',
      nivelDeServicio: '',
      costoPedido: '',
      costoMantenimiento: '',
      loteOptimo: '',
      periodoRevision: '',
      inventarioMaximo: '',
    });
    setAsociacionErrors({});
    setError(null);
  };


  const handleRemoveAsociacion = (index) => {
    const nuevasAsociaciones = [...asociaciones];
    nuevasAsociaciones.splice(index, 1);
    setAsociaciones(nuevasAsociaciones);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (asociaciones.length === 0) {
      setError('Debe asociar al menos un artículo');
      setSubmitting(false);
      return;
    }

    try {
      const proveedorData = {
        nombreProveedor: values.nombreProveedor,
        asociaciones: asociaciones
      };

      console.log("DTO enviado al backend:", proveedorData);
      const response = await api.post('/proveedores', proveedorData);

      setSuccess(`Proveedor "${response.data.nombreProveedor}" creado exitosamente con ${asociaciones.length} artículo(s) asociado(s)`);
      resetForm();
      setAsociaciones([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error al crear proveedor:', err);
      setError(err.response?.data?.message || 'Error al crear el proveedor');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Crear Nuevo Proveedor</h2>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, isValid, dirty }) => (
          <Form>
            <FormBs.Group className="mb-3">
              <FormBs.Label>Nombre del Proveedor *</FormBs.Label>
              <Field
                name="nombreProveedor"
                as={FormBs.Control}
                type="text"
                placeholder="Ingrese nombre del proveedor"
                isInvalid={touched.nombreProveedor && !!errors.nombreProveedor}
              />
              <ErrorMessage name="nombreProveedor" component={FormBs.Text} className="text-danger" />
            </FormBs.Group>

            <div className="border p-3 mb-4 rounded bg-light">
              <h5 className="mb-3">Asociar Artículos *</h5>

              <FormBs.Group className="mb-3">
                <FormBs.Label>Artículo</FormBs.Label>
                <FormBs.Select
                  value={currentAsociacion.codigoArticulo === '' ? '' : String(currentAsociacion.codigoArticulo)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrentAsociacion({
                      ...currentAsociacion,
                      codigoArticulo: val === '' ? '' : Number(val),
                    });
                  }}
                >
                  <option value="">Seleccione un artículo</option>
                  {articulos.map(articulo => (
                    <option key={articulo.codigoArticulo} value={articulo.codigoArticulo}>
                      {articulo.nombreArticulo} (Código: {articulo.codigoArticulo})
                    </option>
                  ))}
                </FormBs.Select>
              </FormBs.Group>

              <FormBs.Group className="mb-3">
                <FormBs.Label>Precio Unitario ($)</FormBs.Label>
                <FormBs.Control
                  type="number"
                  value={currentAsociacion.precioUnitProveedorArticulo}
                  onChange={(e) => setCurrentAsociacion({
                    ...currentAsociacion,
                    precioUnitProveedorArticulo: parseFloat(e.target.value) || 0
                  })}
                  isInvalid={!!asociacionErrors.precioUnitProveedorArticulo}
                />
                {asociacionErrors.precioUnitProveedorArticulo && (
                  <FormBs.Text className="text-danger">{asociacionErrors.precioUnitProveedorArticulo}</FormBs.Text>
                )}
              </FormBs.Group>

              <FormBs.Group className="mb-3">
                <FormBs.Label>Costo de Pedido</FormBs.Label>
                <FormBs.Control
                  type="number"
                  value={currentAsociacion.costoPedido}
                  onChange={(e) =>
                    setCurrentAsociacion({
                      ...currentAsociacion,
                      costoPedido: parseFloat(e.target.value) || 0
                    })
                  }
                  isInvalid={!!asociacionErrors.costoPedido}
                />
                {asociacionErrors.costoPedido && (
                  <FormBs.Text className="text-danger">{asociacionErrors.costoPedido}</FormBs.Text>
                )}

              </FormBs.Group>

              <FormBs.Group className="mb-3">
                <FormBs.Label>Costo de Mantenimiento</FormBs.Label>
                <FormBs.Control
                  type="number"
                  value={currentAsociacion.costoMantenimiento}
                  onChange={(e) =>
                    setCurrentAsociacion({
                      ...currentAsociacion,
                      costoMantenimiento: parseFloat(e.target.value) || 0
                    })
                  }
                  isInvalid={!!asociacionErrors.costoMantenimiento}
                />
                {asociacionErrors.costoMantenimiento && (
                  <FormBs.Text className="text-danger">{asociacionErrors.costoMantenimiento}</FormBs.Text>
                )}
              </FormBs.Group>

              <FormBs.Group className="mb-3">
                <FormBs.Label>Lote Óptimo</FormBs.Label>
                <FormBs.Control
                  type="number"
                  value={currentAsociacion.loteOptimo}
                  onChange={(e) =>
                    setCurrentAsociacion({
                      ...currentAsociacion,
                      loteOptimo: parseInt(e.target.value) || 0
                    })
                  }
                  isInvalid={!!asociacionErrors.loteOptimo}
                />
                {asociacionErrors.loteOptimo && (
                  <FormBs.Text className="text-danger">{asociacionErrors.loteOptimo}</FormBs.Text>
                )}
              </FormBs.Group>

              <FormBs.Group className="mb-3">
                <FormBs.Label>Nivel de Servicio (%)</FormBs.Label>
                <FormBs.Control
                  type="number"
                  min="0"
                  max="100"
                  value={currentAsociacion.nivelDeServicio}
                  onChange={(e) =>
                    setCurrentAsociacion({
                      ...currentAsociacion,
                      nivelDeServicio: e.target.value !== '' ? parseFloat(e.target.value) : ''
                    })
                  }
                  isInvalid={!!asociacionErrors.nivelDeServicio}
                />
                {asociacionErrors.nivelDeServicio && (
                  <FormBs.Text className="text-danger">{asociacionErrors.nivelDeServicio}</FormBs.Text>
                )}
              </FormBs.Group>

              <FormBs.Group className="mb-3">
                <FormBs.Label>Demora de Entrega (días)</FormBs.Label>
                <FormBs.Control
                  type="number"
                  min="1"
                  value={currentAsociacion.demoraEntrega}
                  onChange={(e) => setCurrentAsociacion({
                    ...currentAsociacion,
                    demoraEntrega: e.target.value !== '' ? parseInt(e.target.value) : ''
                  })}
                  isInvalid={!!asociacionErrors.demoraEntrega}
                />
                {asociacionErrors.demoraEntrega && (
                  <FormBs.Text className="text-danger">{asociacionErrors.demoraEntrega}</FormBs.Text>
                )}
              </FormBs.Group>

              {/* Mostrar Período de Revisión solo si modeloInventario === 'TIEMPO_FIJO' */}
              {articuloSeleccionado &&
                articuloSeleccionado.modeloInventario &&
                articuloSeleccionado.modeloInventario.toUpperCase() === 'TIEMPO_FIJO' && (
                  <FormBs.Group className="mb-3">
                    <FormBs.Label>Período de Revisión (días)</FormBs.Label>
                    <FormBs.Control
                      type="number"
                      min="0"
                      value={currentAsociacion.periodoRevision}
                      onChange={(e) =>
                        setCurrentAsociacion({
                          ...currentAsociacion,
                          periodoRevision: e.target.value !== '' ? parseInt(e.target.value) : '',
                        })
                      }
                      isInvalid={!!asociacionErrors.periodoRevision}
                    />
                    {asociacionErrors.periodoRevision && (
                      <FormBs.Text className="text-danger">{asociacionErrors.periodoRevision}</FormBs.Text>
                    )}
                  </FormBs.Group>
                )}

              <FormBs.Group className="mb-3">
                <FormBs.Label>Inventario Máximo</FormBs.Label>
                <FormBs.Control
                  type="number"
                  min="0"
                  value={currentAsociacion.inventarioMaximo}
                  onChange={(e) =>
                    setCurrentAsociacion({
                      ...currentAsociacion,
                      inventarioMaximo: e.target.value !== '' ? parseInt(e.target.value) : '',
                    })
                  }
                  isInvalid={!!asociacionErrors.inventarioMaximo}
                />
                {asociacionErrors.inventarioMaximo && (
                  <FormBs.Text className="text-danger">{asociacionErrors.inventarioMaximo}</FormBs.Text>
                )}
              </FormBs.Group>

              <Button
                variant="primary"
                onClick={handleAddAsociacion}
                disabled={!currentAsociacion.codigoArticulo}
              >
                Agregar Artículo
              </Button>
            </div>

            {asociaciones.length > 0 ? (
              <div className="mb-4">
                <h6>Artículos asociados:</h6>
                <ListGroup>
                  {asociaciones.map((asoc, index) => {
                    const articulo = articulos.find(a => String(a.codigoArticulo) === String(asoc.codigoArticulo));
                    return (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{articulo?.nombreArticulo}</strong>
                          <div className="text-muted">Código: {asoc.codigoArticulo}</div>
                          <div>Precio: ${asoc.precioUnitProveedorArticulo.toFixed(2)}</div>
                          <div>Demora: {asoc.demoraEntrega} días</div>
                          <div>Nivel de Servicio: {asoc.nivelDeServicio}%</div>
                          <div>Período de Revisión: {asoc.periodoRevision} días</div>
                          <div>Inventario Máximo: {asoc.inventarioMaximo}</div>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveAsociacion(index)}
                        >
                          Eliminar
                        </Button>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            ) : (
              <Alert variant="warning" className="mb-4">
                Debe asociar al menos un artículo para crear el proveedor
              </Alert>
            )}

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || !isValid || !dirty || asociaciones.length === 0}
                className="px-4"
              >
                {isSubmitting ? 'Guardando...' : 'Crear Proveedor'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateProveedor;
