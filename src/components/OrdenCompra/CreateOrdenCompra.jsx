import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup'; 
import Button from 'react-bootstrap/Button';
import FormBs from 'react-bootstrap/Form';

const CreateOrdenCompra = () => {
 
    const initialValues = {
    numeroOrdenCompra: '',
    nombreOrdenCompra: '',
    cantidadOrdenCompra: ''
    /*codigoProveedor: '' ESTO IRIA PARA CUANDO CARGA EL PROVEEDOR DETERMINADO*/
  };

  const validationSchema = Yup.object().shape({
      numeroOrdenCompra: Yup.number().required('El campo es obligatorio').min(0, 'No puede ser negativo'),
      nombreOrdenCompra: Yup.string().max(150, 'Descripcion demasiada larga'),
      cantidadOrdenCompra: Yup.number().required('Requerido').min(0, 'No puede ser negativo'), 
      /*codigoProveedor: '' ESTO IRIA PARA CUANDO CARGA EL PROVEEDOR DETERMINADO*/
    });

   
    return (
        <div className='container'>
            <h3 className="my-3">Crear Orden de Compra</h3>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        //ACA FALTA EL ENDPOINT DE LA API 
                        const response = await axios.post('/ordenes-compra', values); 
                        alert('Orden de compra creada exitosamente ✅');
                        resetForm();
                    } catch (error) {
                        console.error('Error al crear orden:', error);
                        alert('❌ Error al crear la orden de compra');
                    } finally {
                        setSubmitting(false);
                    }
                 }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <FormBs.Group className="mb-3">
                            <label htmlFor="numeroOrdenCompra">Número de Orden</label>
                            <Field
                                id="numeroOrdenCompra"
                                name="numeroOrdenCompra"
                                type="number"
                                className="form-control"
                            />
                            <ErrorMessage name="numeroOrdenCompra" component="div" className="text-danger" />
                        </FormBs.Group>

                        <FormBs.Group className="mb-3">
                            <label htmlFor="nombreOrdenCompra">Nombre de Orden</label>
                            <Field
                                id="nombreOrdenCompra"
                                name="nombreOrdenCompra"
                                type="text"
                                className="form-control"
                            />
                            <ErrorMessage name="nombreOrdenCompra" component="div" className="text-danger" />
                        </FormBs.Group>

                        <FormBs.Group className="mb-3">
                            <label htmlFor="cantidadOrdenCompra">Cantidad</label>
                            <Field
                                id="cantidadOrdenCompra"
                                name="cantidadOrdenCompra"
                                type="number"
                                className="form-control"
                            />
                            <ErrorMessage name="cantidadOrdenCompra" component="div" className="text-danger" />
                        </FormBs.Group>

                       {/*} <FormBs.Group className="mb-3">
                            <label htmlFor="proveedorId">Proveedor</label>
                            <Field as="select" name="proveedorId" className="form-control">
                                <option value="">-- Seleccionar proveedor --</option>
                                {proveedores.map((prov) => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.nombre}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="proveedorId" component="div" className="text-danger" />
                        </FormBs.Group>*/}

                        <Button type="submit" disabled={isSubmitting}>Crear Orden</Button>
                    </Form>
                )}
            </Formik>
        </div>
    ); 
}

export default CreateOrdenCompra; 