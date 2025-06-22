import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import FormBs from 'react-bootstrap/Form';
import axios from '../../service/axios.config';
import { Alert } from 'react-bootstrap';

const CreateOrdenCompra = () => {
  const [articulos, setArticulos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [articulosPermitidos, setArticulosPermitidos] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [proveedorSugeridoPorArticulo, setProveedorSugeridoPorArticulo] = useState({});
  const [sugerenciaCantidadPorArticulo, setSugerenciaCantidadPorArticulo] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    axios.get('/articulos')
      .then(res => setArticulos(res.data))
      .catch(err => console.error('Error al cargar artículos:', err));

    axios.get('/proveedores')
      .then(res => setProveedores(res.data))
      .catch(err => console.error('Error al cargar proveedores:', err));
  }, []);

  const fetchArticulosPorProveedor = async (codigoProveedor) => {
    if (!codigoProveedor) {
      setArticulosPermitidos([]);
      return;
    }
    try {
      const res = await axios.get(`/ordenCompra/ArticulosPorProveedor/${codigoProveedor}`);
      if (res.status === 200) {
        setArticulosPermitidos(res.data);
      }
    } catch (error) {
      console.error('Error al traer artículos por proveedor:', error);
      setArticulosPermitidos([]);
    }
  };

  const validationSchema = Yup.object().shape({
    nombreOC: Yup.string().max(150, 'Nombre demasiado largo').required('Campo requerido'),
    codProveedor: Yup.string().required('Seleccione un proveedor'),
    detallesOC: Yup.array().of(
      Yup.object().shape({
        codArticulo: Yup.number()
          .typeError('Seleccione un artículo')
          .required('Seleccione un artículo'),
        cantidadArticulo: Yup.number().required('Ingrese cantidad').min(1, 'Debe ser al menos 1')
      })
    )
  });

  return (
    <div className="container">
      <h3 className="my-3">Crear Orden de Compra</h3>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}
      {info && (
        <Alert variant="warning" onClose={() => setInfo(null)} dismissible>
          {info}
        </Alert>
      )}
      <Formik
        initialValues={{
          nombreOC: '',
          codProveedor: '',
          detallesOC: [{ codArticulo: '', cantidadArticulo: 1 }]
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const detallesOC = values.detallesOC.map(d => ({
              codArticulo: Number(d.codArticulo),
              cantidadArticulo: d.cantidadArticulo
            }));
            const payload = {
              nombreOC: values.nombreOC,
              codProveedor: values.codProveedor,
              detallesOC
            };

            const res = await axios.post('/ordenCompra', payload);
            console.log('🧾 Respuesta completa del backend:', res.data);

            setSuccess('✅ Orden creada exitosamente.');
            resetForm();
            setProveedorSeleccionado('');
            setArticulosPermitidos([]);
            setProveedorSugeridoPorArticulo({});
            setSugerenciaCantidadPorArticulo({});
            if (res.data.advertencia === false) {
  setInfo('⚠️ La orden fue creada, pero hay artículos cuya cantidad no alcanza el punto de pedido.');
}
          } catch (error) {
            console.error('Error al crear orden:', error);
            const msg = error.response?.data;
            if (msg?.includes('PENDIENTE')) {
              setError('El proveedor ya tiene una orden de compra pendiente.');
              setInfo('Espere a que la orden de compra pendiente finalice.');
            } else if (msg?.includes('ENVIADA')) {
              setError('El proveedor ya tiene una orden de compra enviada.');
              setInfo('Espere a que la orden de compra enviada finalice.');
            } else {
                setError(msg || '❌ Error al crear la orden');
            }

          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <FormBs.Group className="mb-3">
              <FormBs.Label>Nombre de la Orden</FormBs.Label>
              <Field name="nombreOC" type="text" className="form-control" />
              <ErrorMessage name="nombreOC" component="div" className="text-danger" />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <FormBs.Label>Proveedor</FormBs.Label>
              <Field
                as="select"
                name="codProveedor"
                className="form-control"
                value={values.codProveedor || ""}
                onChange={async (e) => {
                  const val = e.target.value;
                  setFieldValue('codProveedor', val);
                  setProveedorSeleccionado(val);
                  setProveedorSugeridoPorArticulo({});
                  setSugerenciaCantidadPorArticulo({});
                  setFieldValue('detallesOC', [{ codArticulo: '', cantidadArticulo: 1 }]);
                  await fetchArticulosPorProveedor(val);
                }}
              >
                <option value="">-- Seleccione un proveedor --</option>
                {proveedores.map(p => (
                  <option key={p.codigoProveedor} value={p.codigoProveedor}>
                    {p.nombreProveedor}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="codProveedor" component="div" className="text-danger" />
            </FormBs.Group>

            <FieldArray name="detallesOC">
              {({ push, remove }) => (
                <>
                  {values.detallesOC.map((detalle, index) => (
                    <div key={index} className="row align-items-end mb-3">
                      <div className="col-md-6">
                        <FormBs.Label>Artículo</FormBs.Label>
                        <Field
                          as="select"
                          name={`detallesOC[${index}].codArticulo`}
                          className="form-control"
                          value={detalle.codArticulo || ""}
                          onChange={async (e) => {
                            const codArticulo = Number(e.target.value);
                            setFieldValue(`detallesOC[${index}].codArticulo`, codArticulo);

                            if (codArticulo) {
                              try {
                                const resProv = await axios.get(`/ordenCompra/ProvPredeterminado/${codArticulo}`);
                                console.log(" Respuesta de ProvPredeterminado:", resProv.data);

                                if (resProv.status === 200) {
                                  const nombreProveedor = resProv.data.nombreProveedorPredeterminado;
                                  const codProveedor = resProv.data.codigoProveedor;

                                  setProveedorSugeridoPorArticulo(prev => ({
                                    ...prev,
                                    [index]: nombreProveedor
                                  }));

                                  setSugerenciaCantidadPorArticulo(prev => ({
                                    ...prev,
                                    [index]: '...' // mostrar "..." mientras carga
                                  }));
                                  console.log("🎯 Obteniendo sugerencia cantidad con:", {
                                    codArticulo,
                                    codProveedor
                                  });

                                  const resCant = await axios.get('/ordenCompra/sugerenciaCantidad', {
                                    params: {
                                      codArticulo: codArticulo,
                                      codProveedor: codProveedor
                                    }
                                  });

                                  if (resCant.status === 200) {
                                    setSugerenciaCantidadPorArticulo(prev => ({
                                      ...prev,
                                      [index]: resCant.data
                                    }));
                                  }
                                }
                              } catch (error) {
                                console.error("❌ Error al obtener sugerencias:", error);
                                setProveedorSugeridoPorArticulo(prev => ({ ...prev, [index]: null }));
                                setSugerenciaCantidadPorArticulo(prev => ({ ...prev, [index]: null }));
                              }
                            }
                          }}
                          disabled={!proveedorSeleccionado}
                        >
                          <option value="">-- Seleccionar artículo --</option>
                          {articulosPermitidos.map(a => (
                            <option key={a.codArticulo} value={a.codArticulo}>
                              {a.nombreArticulo}
                            </option>
                          ))}
                        </Field>
                        {proveedorSugeridoPorArticulo[index] && (
                          <small className="text-muted">
                            Proveedor predeterminado: {proveedorSugeridoPorArticulo[index]}
                          </small>
                        )}
                        <ErrorMessage name={`detallesOC[${index}].codArticulo`} component="div" className="text-danger" />
                      </div>

                      <div className="col-md-3">
                        <FormBs.Label>Cantidad</FormBs.Label>
                        <Field
                          name={`detallesOC[${index}].cantidadArticulo`}
                          type="number"
                          min="1"
                          className="form-control"
                        />
                        {typeof sugerenciaCantidadPorArticulo[index] === 'number' && (
                          <small className="text-muted">
                            Sugerencia: pedir {sugerenciaCantidadPorArticulo[index]} unidades.
                          </small>
                        )}
                        {sugerenciaCantidadPorArticulo[index] === '...' && (
                          <small className="text-muted">Cargando sugerencia...</small>
                        )}
                        <ErrorMessage name={`detallesOC[${index}].cantidadArticulo`} component="div" className="text-danger" />
                      </div>

                      <div className="col-md-3">
                        <Button
                          variant="danger"
                          onClick={() => remove(index)}
                          disabled={values.detallesOC.length === 1}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => push({ codArticulo: '', cantidadArticulo: 1 })}
                    disabled={!proveedorSeleccionado}
                    className="mt-2"
                  >
                    Agregar Artículo
                  </Button>
                </>
              )}
            </FieldArray>

            <Button type="submit" disabled={isSubmitting} className="mt-3">
              Crear Orden
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateOrdenCompra;
