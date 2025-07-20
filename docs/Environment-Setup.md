# Configuración de Variables de Entorno

## Descripción

Este proyecto utiliza variables de entorno para configurar las URLs de la API y otras configuraciones sensibles. Las variables de entorno se cargan desde archivos `.env.local` y están centralizadas en el archivo de configuración.

## Archivos de Configuración

### `.env.local` (No se sube al repositorio)
Este archivo contiene las variables de entorno reales para tu entorno local:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://red-networking-backend.vercel.app/api
```

### `.env.example` (Se sube al repositorio)
Este archivo sirve como plantilla para otros desarrolladores:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://red-networking-backend.vercel.app/api
```

## Variables de Entorno Disponibles

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | URL base de la API | `https://red-networking-backend.vercel.app/api` |

## Configuración del Proyecto

### 1. Configuración Inicial

Para configurar el proyecto por primera vez:

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` con tus valores:
   ```bash
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=https://tu-api-url.com/api
   ```

### 2. Uso en el Código

Las variables de entorno se acceden a través del archivo de configuración centralizado:

```typescript
import { API_ENDPOINTS, env } from '@/config/env';

// Usar endpoints predefinidos
const response = await axios.get(`${API_ENDPOINTS.PAGINA_PRINCIPAL}?page=1`);

// Acceder a variables directamente
console.log(env.API_BASE_URL);
```

### 3. Archivo de Configuración (`src/config/env.ts`)

Este archivo centraliza todas las variables de entorno y proporciona:

- **Tipado fuerte** con TypeScript
- **Valores por defecto** para desarrollo
- **Validación** de variables requeridas
- **Endpoints predefinidos** para la API

```typescript
export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://red-networking-backend.vercel.app/api',
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

export const API_ENDPOINTS = {
  PAGINA_PRINCIPAL: `${env.API_BASE_URL}/pagina_principal`,
} as const;
```

## Entornos

### Desarrollo Local
- Usa `.env.local` para configuraciones específicas del desarrollador
- Las variables se cargan automáticamente por Next.js

### Producción
- Las variables se configuran en el servidor de producción (Vercel, Netlify, etc.)
- No uses archivos `.env` en producción

### Staging/Testing
- Crea archivos específicos como `.env.staging` si es necesario
- Asegúrate de que estén en `.gitignore`

## Seguridad

### ✅ Buenas Prácticas
- Usa `NEXT_PUBLIC_` solo para variables que deben estar disponibles en el cliente
- Mantén las claves secretas en variables sin `NEXT_PUBLIC_`
- Nunca subas archivos `.env.local` al repositorio
- Usa valores por defecto seguros en el código

### ❌ Malas Prácticas
- No hardcodees URLs de API en el código
- No subas archivos `.env.local` al repositorio
- No uses variables de entorno para datos sensibles en el cliente

## Troubleshooting

### Variables no se cargan
1. Verifica que el archivo se llame `.env.local`
2. Reinicia el servidor de desarrollo
3. Verifica que las variables tengan el prefijo correcto

### Error de validación
El archivo `src/config/env.ts` valida las variables requeridas y muestra advertencias en la consola si faltan.

### Cambios no se reflejan
1. Reinicia el servidor de desarrollo
2. Limpia la caché de Next.js: `rm -rf .next`
3. Verifica que el archivo `.env.local` esté en la raíz del proyecto

## Ejemplos de Uso

### En Componentes
```typescript
import { API_ENDPOINTS } from '@/config/env';

const fetchData = async (page: number) => {
  const response = await axios.get(`${API_ENDPOINTS.PAGINA_PRINCIPAL}?page=${page}`);
  return response.data;
};
```

### En Servicios
```typescript
import { env } from '@/config/env';

const apiService = {
  baseURL: env.API_BASE_URL,
  
  async get(endpoint: string) {
    return axios.get(`${this.baseURL}${endpoint}`);
  }
};
```

### Validación de Entorno
```typescript
import { env } from '@/config/env';

if (env.IS_DEVELOPMENT) {
  console.log('Running in development mode');
}
``` 