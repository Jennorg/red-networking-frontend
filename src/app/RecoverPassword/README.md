# Componente RecoverPassword

## Descripción General

El componente RecoverPassword proporciona un proceso de recuperación de contraseña en dos pasos para usuarios que han olvidado sus contraseñas. Incluye validación interactiva de requisitos de contraseña y funcionalidad segura de cambio de contraseña.

## Características

### Proceso de Dos Pasos

1. **Paso de Recuperación por Email**: Los usuarios ingresan su dirección de correo electrónico para recibir un enlace de recuperación
2. **Paso de Cambio de Contraseña**: Los usuarios crean una nueva contraseña con validación interactiva

### Requisitos de Contraseña Interactivos

El componente muestra validación en tiempo real para los requisitos de contraseña:

- Mínimo 8 caracteres
- Debe contener al menos una letra mayúscula
- Debe contener al menos una letra minúscula
- Debe contener al menos un número o símbolo
- Las contraseñas deben coincidir (para el campo de confirmación)

### Retroalimentación Visual

- **Íconos**: Check (✓) para requisitos cumplidos, X (✗) para requisitos no cumplidos
- **Colores**: Azul para requisitos cumplidos, gris para requisitos no cumplidos
- **Actualizaciones en tiempo real** mientras el usuario escribe

### Características de Seguridad

- Alternancia de visibilidad de contraseña con íconos de ojo
- Validación de formularios con esquemas Zod
- Comunicación segura con API
- Redirección automática después del cambio exitoso de contraseña

## Estructura del Componente

### Gestión de Estado

```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [emailSent, setEmailSent] = useState(false);
const [email, setEmail] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [passwordRequirements, setPasswordRequirements] = useState({
  minLength: false,
  hasUppercase: false,
  hasLowercase: false,
  hasNumberOrSymbol: false,
  passwordsMatch: false,
});
```

### Esquemas de Formulario

- **recoverPasswordSchema**: Valida la entrada del email
- **changePasswordSchema**: Valida los requisitos de contraseña y confirmación

### Endpoints de API

- `/api/auth/recuperar-contrasena`: Envía email de recuperación
- `/api/auth/cambiar-contrasena`: Cambia la contraseña

## Uso

### Uso Básico

```tsx
import RecoverPassword from "@/app/RecoverPassword/page";

// El componente maneja toda la lógica internamente
<RecoverPassword />;
```

### Navegación

Los usuarios pueden acceder a esta página a través de:

- URL directa: `/RecoverPassword`
- Enlace desde la página de login: "¿Has olvidado tu contraseña?"

## Estilos

### Diseño

- Diseño responsivo con flexbox
- Tema oscuro (`bg-gray-900`)
- Diseño dividido con secciones de formulario e imagen

### Elementos del Formulario

- Campos de entrada con estados de foco
- Mensajes de error en rojo
- Mensajes de éxito en verde
- Estados de carga para botones

### Requisitos de Contraseña

- Lista compacta debajo de los campos de contraseña
- Alineación de íconos y texto
- Retroalimentación codificada por colores

## Accesibilidad

### Navegación por Teclado

- Todos los elementos interactivos son accesibles por teclado
- TabIndex configurado correctamente para botones de alternancia de contraseña

### Lectores de Pantalla

- Etiquetas aria apropiadas para alternancias de visibilidad de contraseña
- Texto alt descriptivo para imágenes
- Estructura HTML semántica

### Contraste de Colores

- Colores de alto contraste para texto y fondos
- Distinción visual clara entre estados

## Dependencias

### Dependencias Principales

- `react-hook-form`: Gestión de estado del formulario
- `@hookform/resolvers/zod`: Integración de validación Zod
- `zod`: Validación de esquemas
- `lucide-react`: Íconos (Eye, EyeOff, Check, X)

### Dependencias de UI

- `@/lib/utils`: Funciones de utilidad (cn)
- `next/link`: Navegación

## Manejo de Errores

### Errores de Red

- Mensajes de error de conexión
- Funcionalidad de reintento
- Degradación elegante

### Errores de Validación

- Validación de formularios en tiempo real
- Mensajes de error claros
- Visualización de errores específicos por campo

## Consideraciones de Seguridad

### Requisitos de Contraseña

- Mínimo 8 caracteres
- Requisitos de mayúsculas y minúsculas
- Requisitos de caracteres especiales
- Coincidencia de confirmación

### Seguridad de API

- Endpoints seguros
- Autenticación basada en tokens
- Sanitización de entrada

## Consideraciones de Pruebas

### Pruebas Unitarias

- Lógica de validación de formularios
- Verificaciones de requisitos de contraseña
- Gestión de estado

### Pruebas de Integración

- Comunicación con API
- Flujos de navegación
- Escenarios de error

### Pruebas E2E

- Flujo completo de recuperación de contraseña
- Escenarios de manejo de errores
- Cumplimiento de accesibilidad

## Mejoras Futuras

### Mejoras Potenciales

- Paso de verificación de email
- Integración de CAPTCHA
- Limitación de tasa
- Medidor de fortaleza de contraseña
- Soporte multiidioma

### Optimizaciones de Rendimiento

- Carga diferida de componentes
- Memoización de lógica de validación
- Re-renderizados optimizados

## Componentes Relacionados

- `Login`: Punto de entrada para recuperación de contraseña
- `Signup`: Registro con requisitos de contraseña similares
- `Dashboard`: Destino post-recuperación
