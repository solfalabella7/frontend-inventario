import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from 'yup'; 
import Button from 'react-bootstrap/Button';
import FormBs from 'react-bootstrap/Form';
import axios from '../../service/axios.config';



const CreateOrdenCompra = () => {
  const [articulos, setArticulos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    axios.get('/articulos')
      .then(res => setArticulos(res.data))
      .catch(err => console.error('Error al cargar artículos:', err));

    axios.get('/proveedores')
      .then(res => setProveedores(res.data))
      .catch(err => console.error('Error al cargar proveedores:', err));
  }, []);

  const initialValues = {
    nombreOC: '',
    codProveedor: '',
    detallesOC: [
      { codArticulo: '', cantidadArticulo: 0 }
    ]
  };

  const validationSchema = Yup.object().shape({
    nombreOC: Yup.string().max(150, 'Nombre demasiado largo').required('Campo requerido'),
    codProveedor: Yup.number().required('Seleccione un proveedor'),
    detallesOC: Yup.array().of(
      Yup.object().shape({
        codArticulo: Yup.string().required('Seleccione un artículo'),
        cantidadArticulo: Yup.number().required('Ingrese cantidad').min(1, 'Debe ser al menos 1')
      })
    )
  });

  return (
    <div className='container'>
      <h3 className="my-3">Crear Orden de Compra</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const response = await axios.post('/ordenCompra', values);
            const { advertencia } = response.data;

            if (advertencia) {
              alert('⚠️ Algunos artículos no superan el punto de pedido.✅ La orden igual ha sido cargada.');
            } else {
              alert('✅ Orden de compra creada exitosamente.');
            }

            resetForm();
          } catch (error) {
            console.error('Error al crear orden:', error);
            alert('❌ Error al crear la orden de compra');
          } finally {
            setSubmitting(false);
  }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <FormBs.Group className="mb-3">
              <label htmlFor="nombreOC">Nombre de Orden</label>
              <Field id="nombreOC" name="nombreOC" type="text" className="form-control" />
              <ErrorMessage name="nombreOC" component="div" className="text-danger" />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <label htmlFor="codProveedor">Proveedor</label>
              <Field as="select" id="codProveedor" name="codProveedor" className="form-control">
                <option value=''>-- Seleccionar proveedor --</option>
                {proveedores.map(p => (
                  <option key={p.codigoProveedor} value={p.codigoProveedor}>{p.nombreProveedor}</option>
                ))}
              </Field>
              <ErrorMessage name="codProveedor" component="div" className="text-danger" />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <FormBs.Label>Estado</FormBs.Label>
              <FormBs.Control type="text" value="PENDIENTE" readOnly plaintext />
            </FormBs.Group>

            <FieldArray name="detallesOC">
              {({ push, remove }) => (
                <div>
                  <h5>Artículos</h5>
                  {values.detallesOC.map((_, index) => (
                    <div key={index} className="row mb-2">
                      <div className="col-md-6">
                        <Field as="select" name={`detallesOC[${index}].codArticulo`} className="form-control">
                          <option value=''>-- Seleccionar artículo --</option>
                          {articulos.map(a => (
                            <option key={a.codigoArticulo} value={a.codigoArticulo}>{a.nombreArticulo}</option>
                          ))}
                        </Field>
                        <ErrorMessage name={`detallesOC[${index}].codArticulo`} component="div" className="text-danger" />
                      </div>
                      <div className="col-md-4">
                        <Field type="number" name={`detallesOC[${index}].cantidadArticulo`} className="form-control" placeholder="Cantidad" />
                        <ErrorMessage name={`detallesOC[${index}].cantidadArticulo`} component="div" className="text-danger" />
                      </div>
                      <div className="col-md-2">
                        <Button variant="danger" onClick={() => remove(index)} disabled={values.detallesOC.length === 1}>X</Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" onClick={() => push({ codArticulo: '', cantidadArticulo: '' })}>Agregar Artículo</Button>
                </div>
              )}
            </FieldArray>

            <Button type="submit" disabled={isSubmitting} className="mt-3">Crear Orden</Button>
          </Form>
        )}
      </Formik>

   
    </div>
  );
};

export default CreateOrdenCompra;
