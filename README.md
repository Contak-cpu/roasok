# Calculadora de Rentabilidad - Tiendanube

Una aplicación web full-stack que se conecta a la API de Tiendanube (Nuvemshop) para calcular la rentabilidad diaria de tu negocio.

## 🚀 Características

- **Integración OAuth 2.0** con Tiendanube
- **Dashboard en tiempo real** con métricas de rentabilidad
- **Cálculo automático** de ventas y costos
- **Recomendaciones inteligentes** basadas en los datos
- **Interfaz responsive** y moderna
- **Despliegue listo** para Vercel

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Autenticación**: NextAuth.js
- **API**: Tiendanube API v1
- **Despliegue**: Vercel
- **Estilo**: Colores personalizados con identidad de marca verde

## 📋 Prerrequisitos

1. Cuenta de desarrollador en Tiendanube
2. Node.js 18+ instalado
3. Cuenta en Vercel (opcional, para despliegue)

## ⚙️ Configuración Local

### 1. Clonar el repositorio

\`\`\`bash
git clone <tu-repositorio>
cd tiendanube-profitability-calculator
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar variables de entorno

Crea un archivo \`.env.local\` en la raíz del proyecto:

\`\`\`env
# Tiendanube OAuth Configuration
NEXT_PUBLIC_TIENDANUBE_CLIENT_ID=tu_client_id_aqui
TIENDANUBE_CLIENT_SECRET=tu_client_secret_aqui
NEXT_PUBLIC_TIENDANUBE_REDIRECT_URI=http://localhost:3000/api/auth/callback/tiendanube

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_muy_seguro_aqui
\`\`\`

### 4. Obtener credenciales de Tiendanube

1. Ve a [Tiendanube Developers](https://developers.tiendanube.com/)
2. Crea una nueva aplicación
3. Configura las URLs de redirección:
   - **Desarrollo**: \`http://localhost:3000/api/auth/callback/tiendanube\`
   - **Producción**: \`https://tu-app.vercel.app/api/auth/callback/tiendanube\`
4. Copia el Client ID y Client Secret

### 5. Ejecutar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🚀 Despliegue en Vercel

### 1. Preparar el proyecto

\`\`\`bash
npm run build
\`\`\`

### 2. Conectar con Vercel

1. Ve a [Vercel](https://vercel.com)
2. Importa tu proyecto desde GitHub
3. Configura las variables de entorno en el dashboard de Vercel

### 3. Variables de entorno en Vercel

En el dashboard de Vercel, agrega estas variables:

\`\`\`env
NEXT_PUBLIC_TIENDANUBE_CLIENT_ID=tu_client_id_aqui
TIENDANUBE_CLIENT_SECRET=tu_client_secret_aqui
NEXT_PUBLIC_TIENDANUBE_REDIRECT_URI=https://tu-app.vercel.app/api/auth/callback/tiendanube
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=tu_secret_muy_seguro_aqui
\`\`\`

### 4. Desplegar

\`\`\`bash
git push origin main
\`\`\`

Vercel desplegará automáticamente tu aplicación.

## 📊 Uso de la Aplicación

### 1. Conectar Tiendanube

1. Haz clic en "Vincular Tiendanube"
2. Autoriza la aplicación en Tiendanube
3. Serás redirigido al dashboard

### 2. Configurar Costos

1. Selecciona la fecha que deseas analizar
2. Ingresa tus costos diarios:
   - **Costo Publicitario**: Gastos en Facebook Ads, Google Ads, etc.
   - **Costo de Producto**: Costo de mercadería vendida (CMG)
   - **Costo de Envíos**: Gastos en logística externa

### 3. Ver Resultados

La aplicación calculará automáticamente:
- Ventas netas del día
- Costos totales
- Rentabilidad diaria
- Margen de rentabilidad
- ROI de publicidad

## 🏗️ Estructura del Proyecto

\`\`\`
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticación OAuth
│   │   ├── sales/         # Datos de ventas
│   │   ├── config/        # Configuración de usuario
│   │   └── calculations/  # Cálculos guardados
│   ├── globals.css        # Estilos globales
│   ├── layout.jsx         # Layout principal
│   ├── page.jsx           # Página de inicio
│   └── providers.jsx      # Providers de React
├── components/            # Componentes reutilizables
│   └── Dashboard.jsx      # Dashboard principal
├── lib/                   # Utilidades y lógica de negocio
│   ├── auth.js            # Configuración NextAuth
│   ├── tiendanube-oauth.js # OAuth de Tiendanube
│   ├── tiendanube-api.js  # Cliente API de Tiendanube
│   ├── profitability-calculator.js # Cálculos de rentabilidad
│   └── data-storage.js    # Persistencia de datos
└── package.json           # Dependencias y scripts
\`\`\`

## 🔧 API Endpoints

### Autenticación
- \`/api/auth/[...nextauth]\` - NextAuth.js handlers
- \`/api/auth/callback/tiendanube\` - Callback OAuth de Tiendanube

### Datos
- \`/api/sales/[date]\` - Obtener ventas de una fecha específica
- \`/api/config\` - Configuración de usuario
- \`/api/calculations\` - Cálculos de rentabilidad guardados
- \`/api/test-connection\` - Probar conexión con Tiendanube

## 🎨 Personalización

### Colores de Marca

La aplicación usa una paleta de colores personalizada basada en verde:

\`\`\`css
:root {
  --konrad-50: #f0fdf4;
  --konrad-600: #16a34a;
  --konrad-900: #14532d;
}
\`\`\`

### Componentes

Los componentes están diseñados para ser modulares y reutilizables. Puedes personalizar:

- Estilos en \`tailwind.config.js\`
- Componentes en \`/components\`
- Lógica de cálculo en \`/lib\`

## 🐛 Solución de Problemas

### Error de OAuth

Si tienes problemas con la autenticación:

1. Verifica que las URLs de redirección coincidan exactamente
2. Asegúrate de que las variables de entorno estén configuradas correctamente
3. Revisa los logs en la consola del navegador

### Error de API

Si la API de Tiendanube no responde:

1. Verifica que el token de acceso sea válido
2. Revisa los límites de rate limiting
3. Confirma que la tienda tenga pedidos en la fecha seleccionada

### Problemas de Despliegue

Si hay errores en Vercel:

1. Revisa las variables de entorno en el dashboard
2. Verifica que el build sea exitoso localmente
3. Revisa los logs de Vercel en el dashboard

## 📝 Licencia

MIT License - Desarrollado por pictoN

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:

- Revisa la documentación de [Tiendanube API](https://developers.tiendanube.com/)
- Consulta la documentación de [Next.js](https://nextjs.org/docs)
- Revisa los issues del repositorio

---

**Desarrollado con ❤️ por pictoN**
