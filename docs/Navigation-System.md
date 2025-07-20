# Sistema de Navegación

## Descripción

El sistema de navegación implementa una navegación completa entre las diferentes vistas del proyecto, excluyendo las páginas de login y signup. El sistema es responsivo y se adapta a diferentes tamaños de pantalla.

## Características

### ✅ **Funcionalidades Implementadas**

- **Navegación Desktop**: Barra de navegación horizontal con iconos y texto
- **Navegación Móvil**: Menú hamburguesa desplegable para dispositivos pequeños
- **Estado Activo**: Indicador visual de la página actual
- **Autenticación**: Navegación solo visible para usuarios autenticados
- **Responsive**: Se adapta automáticamente a diferentes tamaños de pantalla
- **Accesibilidad**: Soporte para navegación por teclado y screen readers

### 🎯 **Vistas Incluidas**

1. **Inicio** (`/`) - Página principal
2. **Ranking** (`/Ranking`) - Ranking de proyectos
3. **Proyectos** (`/Proyecto`) - Explorar proyectos
4. **Perfil** (`/Perfil`) - Perfil de usuario
5. **Estadísticas** (`/estadisticas`) - Análisis y métricas

### 🚫 **Vistas Excluidas**

- Login (`/Login`, `/login`)
- Signup (`/Signup`, `/signup`)

## Componentes

### 1. Navigation (Desktop)
**Archivo**: `src/components/layout/header/Navigation.tsx`

- Navegación horizontal para pantallas medianas y grandes
- Iconos con texto en pantallas grandes
- Solo iconos en pantallas medianas
- Estado activo con fondo azul

### 2. MobileNavigation (Móvil)
**Archivo**: `src/components/layout/header/MobileNavigation.tsx`

- Menú hamburguesa para pantallas pequeñas
- Overlay de fondo oscuro
- Animaciones suaves de entrada/salida
- Descripciones de cada sección

### 3. Header (Contenedor)
**Archivo**: `src/components/layout/header/Header.tsx`

- Integra ambos tipos de navegación
- Maneja la lógica de autenticación
- Responsive layout

## Configuración

### Archivo de Configuración
**Archivo**: `src/config/navigation.ts`

```typescript
export const navigationItems: NavItem[] = [
  {
    name: "Inicio",
    href: "/",
    icon: Home,
    description: "Página principal",
    requiresAuth: true
  },
  // ... más elementos
];
```

### Rutas Públicas vs Protegidas

```typescript
// Rutas públicas (no requieren autenticación)
export const publicRoutes = [
  '/Login', '/Signup', '/login', '/signup'
];

// Rutas protegidas (requieren autenticación)
export const protectedRoutes = [
  '/', '/Ranking', '/Proyecto', '/Perfil', '/estadisticas'
];
```

## Autenticación

### Hook useAuth
**Archivo**: `src/hooks/useAuth.ts`

```typescript
const { shouldShowNavigation, isLoading } = useAuth();
```

**Propiedades**:
- `isAuthenticated`: Estado de autenticación del usuario
- `isLoading`: Estado de carga de la verificación
- `isPublicPage`: Si la página actual es pública
- `shouldShowNavigation`: Si debe mostrar la navegación

### Lógica de Mostrar/Ocultar

```typescript
// Solo mostrar navegación si:
// 1. El usuario está autenticado
// 2. No está en una página pública (login/signup)
const shouldShowNavigation = isAuthenticated && !isPublicPage;
```

## Estilos y Diseño

### Colores y Estados

```css
/* Estado normal */
text-gray-300 hover:bg-gray-700 hover:text-white

/* Estado activo */
bg-blue-600 text-white shadow-md

/* Estado deshabilitado */
opacity-50 cursor-not-allowed
```

### Responsive Breakpoints

- **Móvil** (`< md`): Menú hamburguesa
- **Tablet** (`md - lg`): Iconos + texto
- **Desktop** (`> lg`): Iconos + texto completo

## Uso

### Agregar Nueva Ruta

1. **Actualizar configuración**:
```typescript
// En src/config/navigation.ts
export const navigationItems: NavItem[] = [
  // ... rutas existentes
  {
    name: "Nueva Sección",
    href: "/nueva-seccion",
    icon: NewIcon,
    description: "Descripción de la nueva sección",
    requiresAuth: true
  }
];
```

2. **Crear la página**:
```typescript
// src/app/nueva-seccion/page.tsx
export default function NuevaSeccion() {
  return (
    <DashboardLayout>
      {/* Contenido de la página */}
    </DashboardLayout>
  );
}
```

### Modificar Iconos

```typescript
import { NewIcon } from "lucide-react";

// En la configuración
{
  name: "Sección",
  href: "/seccion",
  icon: NewIcon, // Cambiar aquí
  description: "Descripción"
}
```

## Accesibilidad

### Características Implementadas

- **Navegación por teclado**: Tab, Enter, Escape
- **ARIA labels**: Para screen readers
- **Focus management**: Indicadores visuales de foco
- **Contraste**: Colores con suficiente contraste
- **Semántica**: Uso correcto de elementos HTML

### Ejemplo de Uso Accesible

```typescript
<Link
  href={item.href}
  className={cn(
    "focus:outline-none focus:ring-2 focus:ring-blue-500",
    "focus:ring-offset-2 focus:ring-offset-gray-800"
  )}
  title={item.description} // Tooltip para screen readers
>
  <Icon className="w-4 h-4" aria-hidden="true" />
  <span className="hidden lg:inline">{item.name}</span>
</Link>
```

## Troubleshooting

### Problemas Comunes

1. **Navegación no aparece**:
   - Verificar que el usuario esté autenticado
   - Verificar que no esté en una página pública

2. **Enlaces no funcionan**:
   - Verificar que la ruta existe en `src/app/`
   - Verificar la configuración en `navigation.ts`

3. **Estilos no se aplican**:
   - Verificar que Tailwind CSS esté configurado
   - Verificar las clases de responsive

### Debug

```typescript
// Agregar logs para debug
console.log('Current pathname:', pathname);
console.log('Should show navigation:', shouldShowNavigation);
console.log('Is authenticated:', isAuthenticated);
```

## Mejoras Futuras

### Posibles Extensiones

1. **Breadcrumbs**: Navegación de migas de pan
2. **Submenús**: Menús desplegables anidados
3. **Búsqueda**: Búsqueda en la navegación
4. **Favoritos**: Marcado de páginas favoritas
5. **Historial**: Historial de navegación reciente

### Optimizaciones

1. **Lazy Loading**: Cargar componentes bajo demanda
2. **Caché**: Cachear rutas frecuentes
3. **Analytics**: Tracking de navegación
4. **Personalización**: Temas y colores personalizables 