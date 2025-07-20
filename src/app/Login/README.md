# Componente Login

## Descripción General

El componente Login proporciona funcionalidad de autenticación de usuarios con una interfaz moderna y responsiva. Incluye validación de formularios, alternancia de visibilidad de contraseña y comunicación segura con API para el inicio de sesión de usuarios.

## Características

### Autenticación

- Autenticación por email y contraseña
- Validación de formularios con esquemas Zod
- Comunicación segura con API
- Gestión de sesiones basada en tokens

### Experiencia de Usuario

- Alternancia de visibilidad de contraseña con íconos de ojo
- Validación de formularios en tiempo real
- Estados de carga y manejo de errores
- Diseño responsivo para todos los dispositivos

### Seguridad

- Campo de contraseña con alternancia de visibilidad
- Sanitización y validación de entrada
- Almacenamiento seguro de tokens en localStorage
- Manejo de errores para autenticación fallida

## Estructura del Componente

### Gestión de Estado

```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [showPassword, setShowPassword] = useState(false);
```

### Esquema de Formulario

```typescript
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("El correo electrónico no es válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});
```

### Endpoint de API

- `POST /api/auth/login`: Autentica al usuario y devuelve token

## Uso

### Uso Básico

```tsx
import Login from "@/app/Login/page";

// El componente maneja toda la lógica internamente
<Login />;
```

### Navegación

Los usuarios pueden acceder a esta página a través de:

- URL directa: `/Login`
- Enlace desde la página de registro: "¿Ya tienes una cuenta?"
- Ruta por defecto: `/`

## Estilos

### Diseño

- Diseño responsivo con flexbox
- Tema oscuro (`bg-gray-900`)
- Diseño dividido con secciones de formulario e imagen
- Enfoque mobile-first

### Elementos del Formulario

- Campos de entrada con estados de foco
- Mensajes de error en rojo
- Mensajes de éxito en verde
- Estados de carga para botones
- Alternancia de visibilidad de contraseña

### Diseño Visual

- Logo de UNEG prominentemente mostrado
- Interfaz limpia y moderna
- Esquema de colores consistente
- Tipografía profesional

## Accesibilidad

### Navegación por Teclado

- Todos los elementos del formulario son accesibles por teclado
- TabIndex configurado correctamente para alternancia de contraseña
- Tecla Enter envía el formulario

### Lectores de Pantalla

- Etiquetas aria apropiadas para alternancia de visibilidad de contraseña
- Texto alt descriptivo para imágenes
- Estructura HTML semántica
- Etiquetas de formulario y mensajes de error

### Contraste de Colores

- Colores de alto contraste para texto y fondos
- Distinción visual clara entre estados
- Combinaciones de colores accesibles

## Dependencias

### Dependencias Principales

- `react-hook-form`: Gestión de estado del formulario
- `@hookform/resolvers/zod`: Integración de validación Zod
- `zod`: Validación de esquemas
- `lucide-react`: Íconos (Eye, EyeOff)

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
- Mensajes de error específicos por campo
- Visualización clara de errores

### Errores de Autenticación

- Manejo de credenciales inválidas
- Mensajes de error amigables para el usuario
- Respuestas de error seguras

## Consideraciones de Seguridad

### Seguridad de Contraseña

- Alternancia de visibilidad de contraseña
- Manejo seguro de entrada
- Sin registro de contraseñas

### Gestión de Sesiones

- Almacenamiento de tokens en localStorage
- Manejo seguro de tokens
- Gestión automática de sesiones

### Seguridad de API

- Endpoints seguros
- Validación de entrada
- Sanitización de mensajes de error

## Flujo de Autenticación

### Proceso de Login

1. El usuario ingresa email y contraseña
2. El formulario valida la entrada
3. Se envía solicitud a la API
4. Se recibe y almacena el token
5. El usuario es redirigido al dashboard

### Escenarios de Error

- Credenciales inválidas
- Errores de red
- Errores del servidor
- Errores de validación

## Consideraciones de Pruebas

### Pruebas Unitarias

- Lógica de validación de formularios
- Gestión de estado
- Manejo de errores

### Pruebas de Integración

- Comunicación con API
- Flujo de autenticación
- Escenarios de error

### Pruebas E2E

- Flujo completo de login
- Escenarios de manejo de errores
- Cumplimiento de accesibilidad

## Rendimiento

### Optimizaciones

- Carga diferida de componentes
- Memoización de lógica de validación
- Re-renderizados optimizados
- Gestión eficiente de estado

### Estados de Carga

- Indicadores de carga en botones
- Retroalimentación de envío de formulario
- Gestión de estados de error

## Mejoras Futuras

### Mejoras Potenciales

- Funcionalidad "Recordarme"
- Integración de login social
- Autenticación de dos factores
- Indicador de fortaleza de contraseña
- Soporte multiidioma

### Mejoras de Seguridad

- Integración de CAPTCHA
- Limitación de tasa
- Restricciones basadas en IP
- Tiempo de expiración de sesión

## Componentes Relacionados

- `Signup`: Registro de usuarios
- `RecoverPassword`: Recuperación de contraseña
- `Dashboard`: Destino post-login

## Integración con API

### Formato de Solicitud

```typescript
{
  email: string;
  password: string;
}
```

### Formato de Respuesta

```typescript
{
  proceso: boolean;
  message: string;
  token?: {
    token: string;
    id: string;
  };
}
```

### Manejo de Errores

- Errores de red
- Fallos de autenticación
- Errores de validación
- Errores del servidor
