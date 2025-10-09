# Bienvenido a la aplicación RKT-Almacenes-Reguladores

Esta aplicación sirve para gestionar los almacenes reguladores de la empresa RIKUTEC en diferentes ciudades claves logísiticamente.

# Descripción de la funcionalidad de la aplicación
Esta aplicación realiza los siguientes pasos:
1) Gestiona la autenticación de usuarios permitiendo dar altas y bajas a usuarios para el manejo de la aplicación
2) Permite la subida de ficheros de pedido de fábrica con numeración PV.... a un bucket de AWS S3
3) Una vez el pedido está en el bucket S3 arrancará un sistema que extraerá la información del fichero PDF (pedido) y anotará en un fichero excel una nueva línea con los diferentes datos del pedido.

# Arquitectura de la Aplicación Web Serverless
El núcleo de la solución se basa en los siguientes servicios de AWS:
1. Alojamiento Web (Frontend):
    * Amazon S3: Se utiliza un bucket de S3 configurado para alojar sitios web estáticos. Aquí guardarás tus ficheros HTML, CSS, y JavaScript (por ejemplo, los que genera un framework como React, Vue o Angular).
    * Amazon CloudFront: Es una red de entrega de contenido (CDN) que se pone delante de tu bucket S3. Proporciona dos cosas clave: una distribución global de baja latencia (tu web cargará rápido en cualquier parte del mundo) y, fundamentalmente, la capacidad de usar HTTPS con un certificado SSL/TLS gratuito, lo cual es imprescindible para la seguridad.
2. Autenticación de Usuarios:
    * Amazon Cognito: Será el "portero" de tu aplicación. Cognito gestionará todo el ciclo de vida de los usuarios: registro, inicio de sesión, y recuperación de contraseñas. Una vez que un usuario inicia sesión correctamente, Cognito le entrega un token web (JWT) que lo identifica de forma segura.
3. Lógica de Negocio (Backend):
    * Amazon API Gateway: Actúa como la puerta de entrada para todas las peticiones del backend. Expondrá un endpoint seguro (por ejemplo, /generar-url-subida) al que tu aplicación web podrá llamar.
    * AWS Lambda: Es la función que se ejecuta detrás de API Gateway. Su única misión será generar una URL segura y temporal para que el usuario pueda subir el fichero directamente a S3.
4. Almacenamiento de Ficheros:
    * Amazon S3: Es el mismo bucket de destino que mencionamos en la arquitectura anterior, el que tiene la notificación de eventos para disparar el proceso de reconocimiento de texto.

# Flujo de Funcionamiento Paso a Paso
1. Acceso y Autenticación:
    * El usuario navega a la URL de tu aplicación (la de CloudFront).
    * El frontend, usando la librería de AWS Amplify, muestra un formulario de inicio de sesión gestionado por Amazon Cognito.
    * El usuario se registra o inicia sesión. Si los datos son correctos, Cognito devuelve un token JWT a la aplicación, que se guarda en el navegador.
2. Selección del Fichero:
    * Una vez dentro de la aplicación, el usuario ve un botón para "Subir Pedido". Hace clic, y selecciona el fichero PDF de su ordenador.
3. Solicitud de Permiso para Subir (Paso Clave):
    * En lugar de enviar el fichero directamente desde el navegador al servidor (lo cual es ineficiente), el código JavaScript de tu frontend hace una petición al API Gateway. En esta petición, incluye el token JWT del usuario para demostrar que está autenticado.
    * API Gateway recibe la petición y dispara la función Lambda.
4. Generación de la URL Segura (Presigned URL):
    * La función Lambda primero valida el token JWT para asegurarse de que la petición es legítima.
    * Si es válida, la Lambda utiliza el SDK de AWS para generar una URL Prefirmada de S3 (S3 Presigned URL). Esta es una URL única y de corta duración (por ejemplo, válida por 5 minutos) que otorga permiso temporal para subir un fichero específico a una ruta concreta dentro de tu bucket S3.
    * La Lambda devuelve esta URL prefirmada a la aplicación web.
5. Subida Directa a S3:
    * Con la URL prefirmada en su poder, el código JavaScript del navegador realiza una subida HTTP PUT del fichero PDF directamente a esa URL. El fichero viaja desde el navegador del usuario directamente al bucket de S3, sin pasar por tu backend (Lambda/API Gateway), lo cual es mucho más rápido y escalable.
6. Inicio del Proceso de Backend:
    * El fichero PDF aterriza en el bucket S3.
    * ¡Y listo! En este punto, el evento S3 se dispara y arranca todo el flujo de trabajo con Textract que definimos anteriormente.

## Características
- **Framework**: Astro con React
- **Despliegue**: AWS Amplify (estático)
- **Autenticación**: Preparado para AWS Cognito (con modo mock)
- **Responsive**: Menú adaptativo para móviles
- **Funcionalidades**:
  - Login con usuario demo
  - Subida de archivos PDF
  - Visualización de pedidos
  - Gestión de usuarios (placeholder)

## Environments variables
Fichero .env
* PUBLIC_IS_MOCK ==> true. Permite el usuario demo@rkt-regulador.com con password demo123
                        y las cajas de texto está pre-rellenadas
* PUBLIC_IS_MOCK ==> false. No pernite el usuario DEMO

## Usuario Demo
Cuando `PUBLIC_IS_MOCK=true`:
- Email: demo@rkt-regulador.com
- Password: demo123

## Comandos
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

## Estructura del Proyecto
src/
├── components/          # Componentes React
│   ├── Layout.tsx      # Layout principal con menú
│   ├── Login.tsx       # Formulario de login
│   ├── FileUpload.tsx  # Subida de archivos
│   └── PedidosList.tsx # Lista de pedidos
├── pages/              # Páginas Astro
│   ├── index.astro     # Login page
│   ├── inicio.astro    # Dashboard
│   ├── subir-pedido.astro
│   ├── ver-pedidos.astro
│   └── usuarios.astro
└── services/
    └── api.ts          # Servicio centralizado de API

## Despliegue en AWS Amplify
1. Conectar repositorio Git
2. Configurar variables de entorno en Amplify Console
3. El archivo `amplify.yml` maneja el proceso de build automáticamente