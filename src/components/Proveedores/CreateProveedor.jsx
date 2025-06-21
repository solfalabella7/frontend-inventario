import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form as FormBs, Alert, ListGroup, Badge } from 'react-bootstrap';
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
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleAddAsociacion = () => {
    if (!currentAsociacion.codigoArticulo) {
      setError('Debe seleccionar un artículo');
      return;
    }

    // Verificar si el artículo ya está en las asociaciones
    if (asociaciones.some(a => a.codigoArticulo === currentAsociacion.codigoArticulo)) {
      setError('Este artículo ya está seleccionado');
      return;
    }

    setAsociaciones([...asociaciones, currentAsociacion]);
    setCurrentAsociacion({
      codigoArticulo: '',
      precioUnitProveedorArticulo: '',
      demoraEntrega: '',
      nivelDeServicio: '',
      costoPedido: '',
      costoMantenimiento: '',
      loteOptimo: '',
    });
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
                  value={currentAsociacion.codigoArticulo}
                  onChange={(e) => setCurrentAsociacion({
                    ...currentAsociacion,
                    codigoArticulo: parseInt(e.target.value)
                  })}
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
                  step="0.01"
                  min="0"
                  value={currentAsociacion.precioUnitProveedorArticulo}
                  onChange={(e) => setCurrentAsociacion({
                    ...currentAsociacion,
                    precioUnitProveedorArticulo: parseFloat(e.target.value) || 0
                  })}
                />
              </FormBs.Group>

              <FormBs.Group className="mb-3">
              <label htmlFor='costoPedido'>Costo de Pedido</label>
              <FormBs.Control
                id='costoPedido'
                type='number'
                value={currentAsociacion.costoPedido}
                onChange={(e) =>
                  setCurrentAsociacion({
                    ...currentAsociacion,
                    costoPedido: parseFloat(e.target.value) || 0
                  })
                }
              />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <label htmlFor='costoMantener'>Costo de Mantenimiento</label>
              <FormBs.Control
                id='costoMantener'
                type='number'
                value={currentAsociacion.costoMantenimiento}
                onChange={(e) =>
                  setCurrentAsociacion({
                    ...currentAsociacion,
                    costoMantenimiento: parseFloat(e.target.value) || 0
                  })
                }
              />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <label htmlFor='loteOptimo'>Lote Optimo</label>
              <FormBs.Control
                id='loteOptimo'
                type='number'
                value={currentAsociacion.loteOptimo}
                onChange={(e) =>
                  setCurrentAsociacion({
                    ...currentAsociacion,
                    loteOptimo: parseInt(e.target.value) || 0
                  })
                }
              />
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
                />
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
                />
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
                    // const articulo = articulos.find(a => a.codigoArticulo === asoc.codigoArticulo);
                    const articulo = articulos.find(a => String(a.codigoArticulo) === String(asoc.codigoArticulo));
                    return (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{articulo?.nombreArticulo}</strong>
                          <div className="text-muted">Código: {asoc.codigoArticulo}</div>
                          <div>Precio: ${asoc.precioUnitProveedorArticulo.toFixed(2)}</div>
                          <div>Demora: {asoc.demoraEntrega} días</div>
                          <div>Nivel de Servicio: {asoc.nivelDeServicio}%</div>
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