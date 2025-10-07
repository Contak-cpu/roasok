# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar tu Calculadora de Rentabilidad de Tiendanube en Vercel de manera rápida y sencilla.

## 📋 Pasos para Desplegar

### 1. Preparar el Repositorio

✅ **Ya completado**: Tu código está subido a [https://github.com/Contak-cpu/roasok](https://github.com/Contak-cpu/roasok)

### 2. Crear Cuenta en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Conecta tu cuenta de GitHub
4. Autoriza a Vercel para acceder a tus repositorios

### 3. Importar el Proyecto

1. En el dashboard de Vercel, haz clic en "New Project"
2. Busca y selecciona el repositorio `Contak-cpu/roasok`
3. Haz clic en "Import"

### 4. Configurar Variables de Entorno

En la página de configuración del proyecto, agrega estas variables:

#### Variables Obligatorias:

```env
NEXT_PUBLIC_TIENDANUBE_CLIENT_ID=tu_client_id_de_tiendanube
TIENDANUBE_CLIENT_SECRET=tu_client_secret_de_tiendanube
NEXT_PUBLIC_TIENDANUBE_REDIRECT_URI=https://tu-app.vercel.app/api/auth/callback/tiendanube
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=genera_un_secret_muy_seguro_aqui
```

#### Cómo obtener las credenciales de Tiendanube:

1. Ve a [Tiendanube Developers](https://developers.tiendanube.com/)
2. Crea una nueva aplicación
3. Configura la URL de redirección como: `https://tu-app.vercel.app/api/auth/callback/tiendanube`
4. Copia el Client ID y Client Secret

#### Generar NEXTAUTH_SECRET:

Puedes generar un secret seguro usando:

```bash
openssl rand -base64 32
```

O usar cualquier generador de strings aleatorios.

### 5. Configurar el Proyecto

- **Framework Preset**: Next.js (se detecta automáticamente)
- **Root Directory**: `./` (dejar por defecto)
- **Build Command**: `npm run build` (por defecto)
- **Output Directory**: `.next` (por defecto)
- **Install Command**: `npm install` (por defecto)

### 6. Desplegar

1. Haz clic en "Deploy"
2. Espera a que termine el proceso de build
3. ¡Tu aplicación estará disponible en la URL que te proporcione Vercel!

## 🔧 Configuración Adicional

### Dominio Personalizado (Opcional)

1. En el dashboard de tu proyecto en Vercel
2. Ve a "Settings" > "Domains"
3. Agrega tu dominio personalizado
4. Configura los DNS según las instrucciones

### Variables de Entorno por Ambiente

Puedes configurar variables diferentes para:
- **Production**: Variables para producción
- **Preview**: Variables para branches de desarrollo
- **Development**: Variables para desarrollo local

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

1. Ve al dashboard de tu proyecto en Vercel
2. Haz clic en "Functions" para ver los logs de las API routes
3. Usa "View Function Logs" para debugging

### Métricas de Performance

Vercel te proporciona métricas automáticas:
- Tiempo de respuesta
- Uso de memoria
- Número de requests
- Errores

## 🔄 Despliegues Automáticos

Una vez configurado, Vercel desplegará automáticamente:

- **Producción**: Cada push a la rama `main`
- **Preview**: Cada push a otras ramas
- **Development**: Para desarrollo local con `vercel dev`

## 🐛 Solución de Problemas Comunes

### Error de Build

Si el build falla:

1. Revisa los logs en el dashboard de Vercel
2. Verifica que todas las dependencias estén en `package.json`
3. Asegúrate de que no haya errores de TypeScript

### Error de Variables de Entorno

Si hay problemas con las variables:

1. Verifica que todas las variables estén configuradas
2. Asegúrate de que no tengan espacios extra
3. Revisa que las URLs sean exactas

### Error de OAuth

Si OAuth no funciona:

1. Verifica que la URL de redirección en Tiendanube coincida exactamente
2. Asegúrate de que las variables `NEXT_PUBLIC_TIENDANUBE_*` estén configuradas
3. Revisa los logs de la función `/api/auth/callback/tiendanube`

## 📱 Testing en Producción

Una vez desplegado:

1. Visita la URL de tu aplicación
2. Prueba el flujo completo de OAuth
3. Verifica que los cálculos funcionen correctamente
4. Revisa que la interfaz se vea bien en móvil

## 🔒 Seguridad

### Variables Sensibles

- ✅ `TIENDANUBE_CLIENT_SECRET` está marcada como sensible
- ✅ `NEXTAUTH_SECRET` está marcada como sensible
- ❌ `NEXT_PUBLIC_*` son públicas (está bien para Client ID)

### HTTPS

Vercel proporciona HTTPS automáticamente para todos los dominios.

## 📈 Optimizaciones

### Performance

- Next.js 14 con App Router está optimizado para Vercel
- Las imágenes se optimizan automáticamente
- Las funciones serverless se ejecutan en edge locations

### SEO

- Metadata configurada en `app/layout.jsx`
- URLs amigables
- Sitemap automático (si lo configuras)

## 🎯 Próximos Pasos

Una vez desplegado:

1. **Configura un dominio personalizado** si lo deseas
2. **Configura analytics** (Vercel Analytics está disponible)
3. **Configura monitoreo de errores** (Sentry, etc.)
4. **Optimiza las métricas** según tus necesidades

---

¡Tu aplicación estará lista para usar en producción! 🎉

**Desarrollado por pictoN** - [Repositorio](https://github.com/Contak-cpu/roasok)
