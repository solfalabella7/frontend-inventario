import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup'


const FormCreateArticulo = () => {

    const initialValues = {
        nombreArticulo: '',
        //codigoArticulo: '',
        descripcion: '',
        stockActualArticulo: '',
        stockSeguridadArticulo: ''
    }

    const validationSchema= Yup.object().shape({
        nombreArticulo: Yup.string().required('El campo es obligatorio'),
        //codigoArticulo: Yup.number().required('Requerido'),
        descripcion: Yup.string()
                        .max(150, 'Descripcion demasiada larga'),
        stockActualArticulo: Yup.number()
                                .required('Requerido')
                                .min(0, 'No puede ser negativo'),
        stockSeguridadArticulo: Yup.number()
                                    .required('Requerido')
                                    .min(0, 'No puede ser negativo')
    })
        
    
    return(
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={ async (values,  { resetForm, setSubmitting }) => {
                try {
                    const response = await fetch("http://localhost:8080/api/articulos", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(values)
                    });

                    if (!response.ok) throw new Error("Fallo al guardar");

                    alert("Artículo guardado exitosamente");
                } catch (error) {
                    alert("Error al guardar el artículo");
                } finally {
                    setSubmitting(false);
                }
                console.log(values);
            }}
            >
              {
                ({ values, isSubmitting, errors, touched }) => ( //funcion que renderiza el formulario de formik
                    <Form>
                        <label htmlFor= 'nombreArticulo'>Nombre del Articulo</label>
                        <Field id= 'nombreArticulo' type= 'text' placeholder='Articulo' name='nombreArticulo'/>
                        <ErrorMessage name="nombreArticulo" component="div" className="text-danger"  
                        //vemos si hay errores en el campo 
                        />
                        {/*<label htmlFor= 'codigoArticulo'>Codigo</label>
                        <Field id= 'codigoArticulo' type= 'number' placeholder='Codigo' name='codigoArticulo'/>
                        <ErrorMessage name="codigoArticulo" component="div" className="text-danger"/> */}
                        <label htmlFor= 'descripcion'>Descripcion</label>
                        <Field id= 'descripcion' type= 'text' placeholder='descripcion' name='descripcion'/>
                        <ErrorMessage name=" descripcion" component="div" className="text-danger"  /> 
                        <Field id= 'stockActualArticulo' type= 'number' placeholder='StockActual' name='stockActualArticulo'/>
                        <ErrorMessage name="stockActualArticulo" component="div" className="text-danger" /> 
                        <Field id= 'stockSeguridadArticulo' type= 'number' placeholder='StockSeguridad' name='stockSeguridadArticulo'/>
                        <ErrorMessage name="stockSeguridadArticulo" component="div" className="text-danger" /> 
                         
                         <button type = 'submit'>Cargar nuevo articulo</button>
                         {
                            isSubmitting ? (<p>Enviando nuevo articulo</p>) : null
                         }
                    
                    </Form>
                )
              }  
        </Formik>
    ); 
}
export default FormCreateArticulo; 