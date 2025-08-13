**Sistema de Gestión de Inventario - Frontend**

*MVP de manejo de inventarios, pronósticos de demanda y gestión de stock.*

**Descripción:**

Este proyecto corresponde al frontend de un sistema de gestión de inventarios y pronósticos de demanda. Permite administrar artículos, proveedores, órdenes de compra y ventas, asegurando un control completo del stock de una empresa.
Está desarrollado con React y se comunica con un backend en Java Spring Boot conectado a una base de datos MariaDB.

Link del Backend: https://github.com/MartinaLuconi/InventarioyStock.git


**Funcionalidades principales:**
- Alta, baja y modificación de artículos.
- Determinación del modelo de inventario (lote fijo o intervalo fijo).
- Listado de productos a reponer y faltantes.
- Alta, baja y modificación de proveedores.
- Asociación de proveedores y artículos.
- Alta y modificación de órdenes de compra con gestión de estados (pendiente, enviada, finalizada, cancelada).
- Alta de ventas.
- Cálculos y verificaciones automáticas de stock.


**Tecnologías utilizadas:**

  1. Frontend:
  - React 18
  - React Router DOM
  - Axios
  - Formik + Yup (validación de formularios)
  - Bootstrap 5 + React Bootstrap + Bootstrap Icons
  - Material UI (MUI)

  2. Estilos:
  - CSS Modules / Sass
  
  3. Desarrollo:
  - Vite
  - ESLint


**Requisitos previos:**
- Node.js 18 o superior
- Acceso al backend y base de datos configurados


**Instalación y ejecución:**

1. Clonar el repositorio frontend:

- git clone solfalabella7/frontend-inventario
- cd <CARPETA_FRONTEND>

2. Instalar dependencias:
- npm install

3. Configurar conexión con el backend en axios.config.js.

4. Ejecutar en modo desarrollo:
- npm run dev
