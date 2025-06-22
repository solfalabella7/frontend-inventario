import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form as FormBs, Alert, Spinner, ListGroup, Row, Col } from 'react-bootstrap';
import axios from '../../service/axios.config';

const EditarProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [proveedor, setProveedor] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const cargarDatos = async () => {
    try {
      // Pedimos proveedor, artículos y asociaciones con DTO correcto
      const [{ data: proveedorData }, { data: articulosData }, { data: asociacionesData }] = await Promise.all([
        axios.get(`/proveedores/${id}`),
        axios.get('/articulos'),
        axios.get(`/proveedores/${id}/articulos`)
      ]);

      setProveedor(proveedorData);
      setArticulos(articulosData);

      // Completamos nombre del artículo desde lista general
      const asociacionesConNombre = asociacionesData.map(a => {
        const art = articulosData.find(art => art.codigoArticulo === a.codigoArticulo);
        return {
          ...a,
          nombreArticulo: art?.nombreArticulo || 'Artículo desconocido'
        };
      });

      setAsociaciones(asociacionesConNombre);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  cargarDatos();
}, [id]);


  const validationSchema = Yup.object().shape({
    nombreProveedor: Yup.string().required('El nombre es obligatorio'),
  });

  const handleAsociacionChange = (index, field, value) => {
    const nuevas = [...asociaciones];
    nuevas[index][field] = value;
    setAsociaciones(nuevas);
  };

  const handleRemove = index => {
    const nuevas = [...asociaciones];
    nuevas.splice(index, 1);
    setAsociaciones(nuevas);
  };

  const handleAddAsociacion = () => {
    setAsociaciones([
      ...asociaciones,
      {
        codigoArticulo: '',
        precioUnitProveedorArticulo: '',
        demoraEntrega: '',
        nivelDeServicio: '',
        costoPedido: '',
        costoMantenimiento: '',
        esPredeterminado: false,
        periodoRevision: '',
      },
    ]);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (asociaciones.length === 0) {
      setError('Debe asociar al menos un artículo');
      setSubmitting(false);
      return;
    }

    try {
      const dto = {
        nombreProveedor: values.nombreProveedor,
        asociaciones: asociaciones.map(a => ({
          codigoArticulo: Number(a.codigoArticulo),
          demoraEntrega: Number(a.demoraEntrega),
          precioUnitProveedorArticulo: Number(a.precioUnitProveedorArticulo),
          costoPedido: Number(a.costoPedido),
          costoMantenimiento: Number(a.costoMantenimiento),
          esPredeterminado: a.esPredeterminado || false,
          nivelDeServicio: Number(a.nivelDeServicio),
          periodoRevision: Number(a.periodoRevision) || 0,
        })),
      };
      await axios.put(`/proveedores/${id}`, dto);
      setSuccess('Proveedor actualizado correctamente');
      setTimeout(() => navigate('/proveedores'), 2000);
    } catch (err) {
      setError('Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="container mt-4">
      <h2>Editar Proveedor</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Formik
        initialValues={{ nombreProveedor: proveedor.nombreProveedor }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <FormBs.Group className="mb-3">
              <FormBs.Label>Nombre</FormBs.Label>
              <Field as={FormBs.Control} name="nombreProveedor" />
              <ErrorMessage name="nombreProveedor" component="div" className="text-danger" />
            </FormBs.Group>

            <h5>Artículos Asociados</h5>
            {asociaciones.map((a, i) => (
              <div key={i} className="mb-3 p-3 border rounded">
                <Row>
                  <Col md={6}>
                    <FormBs.Label>Artículo</FormBs.Label>
                   

                    {/* Campo oculto para enviar el código del artículo */}
                    <input
                      type="hidden"
                      name={`asociaciones[${i}].codigoArticulo`}
                      value={a.codigoArticulo}
                    />

                    {/* Mostrar el nombre del artículo en modo solo lectura */}
                    <FormBs.Control
                      plaintext
                      readOnly
                      value={a.nombreArticulo || 'Artículo no encontrado'}
                      className="bg-light"
                    />

                  </Col>
                  <Col md={6}>
                    <FormBs.Label>Precio</FormBs.Label>
                    <FormBs.Control
                      type="number"
                      value={a.precioUnitProveedorArticulo}
                      onChange={e => handleAsociacionChange(i, 'precioUnitProveedorArticulo', e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col md={4}>
                    <FormBs.Label>Demora</FormBs.Label>
                    <FormBs.Control
                      type="number"
                      value={a.demoraEntrega}
                      onChange={e => handleAsociacionChange(i, 'demoraEntrega', e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <FormBs.Label>Nivel Servicio</FormBs.Label>
                    <FormBs.Control
                      type="number"
                      value={a.nivelDeServicio}
                      onChange={e => handleAsociacionChange(i, 'nivelDeServicio', e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <FormBs.Label>Costo de Pedido</FormBs.Label>
                    <FormBs.Control
                      type="number"
                      value={a.costoPedido}
                      onChange={e => handleAsociacionChange(i, 'costoPedido', e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">

                  <Col md={4}>
                    <FormBs.Label>Costo Mantenimiento</FormBs.Label>
                    <FormBs.Control
                      type="number"
                      value={a.costoMantenimiento}
                      onChange={e => handleAsociacionChange(i, 'costoMantenimiento', e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <FormBs.Label>Periodo Revisión</FormBs.Label>
                    <FormBs.Control
                      type="number"
                      value={a.periodoRevision}
                      onChange={e => handleAsociacionChange(i, 'periodoRevision', e.target.value)}
                    />
                  </Col>

                </Row>
                <div className="mt-3 text-end">
                  <Button variant="outline-danger" onClick={() => handleRemove(i)}>Eliminar</Button>
                </div>
              </div>
            ))}

            <Button variant="secondary" className="mb-3" onClick={handleAddAsociacion}>Agregar Artículo</Button>

            <div className="text-end">
              <Button type="submit" disabled={isSubmitting} variant="primary">
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditarProveedor;
