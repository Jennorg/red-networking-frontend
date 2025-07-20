# Componente Signup

## Descripción General

El componente Signup proporciona funcionalidad de registro de usuarios con validación completa de formularios, requisitos de contraseña interactivos y una interfaz moderna y responsiva. Incluye validación de fecha de nacimiento y creación segura de cuentas de usuario.

## Características

### Formulario de Registro

- Entrada de nombre completo y email
- Selección de fecha de nacimiento con selector de calendario
- Creación de contraseña con requisitos interactivos
- Validación de formularios con esquemas Zod

### Requisitos de Contraseña Interactivos

El componente muestra validación en tiempo real para los requisitos de contraseña:

- Mínimo 8 caracteres
- Debe contener al menos una letra mayúscula
- Debe contener al menos una letra minúscula
- Debe contener al menos un número o símbolo

### Experiencia de Usuario

- Alternancia de visibilidad de contraseña con íconos de ojo
- Validación de formularios en tiempo real
- Calendario interactivo para selección de fecha
- Diseño responsivo para todos los dispositivos

### Seguridad

- Campo de contraseña con alternancia de visibilidad
- Sanitización y validación de entrada
- Comunicación segura con API
- Verificación de edad (mínimo 16 años)

## Estructura del Componente

### Gestión de Estado

```typescript
const [showPassword, setShowPassword] = useState(false);
const [passwordRequirements, setPasswordRequirements] = useState({
  minLength: false,
  hasUppercase: false,
  hasLowercase: false,
  hasNumberOrSymbol: false,
});
```

### Esquema de Formulario

```typescript
const formSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre es requerido")
    .refine((value) => value.trim().split(/\s+/).length >= 2, {
      message: "Debe incluir nombre y apellido",
    }),
  birthdate: z.date({
    required_error: "La fecha de nacimiento es requerida",
  }),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(
      /[0-9!@#$%^&*(),.?":{}|<>]/,
      "Debe contener al menos un número o símbolo"
    ),
});
```

### Endpoint de API

- `POST /api/auth/register`: Crea nueva cuenta de usuario

## Uso

### Uso Básico

```tsx
import Signup from "@/app/Signup/page";

// El componente maneja toda la lógica internamente
<Signup />;
```

### Navegación

Los usuarios pueden acceder a esta página a través de:

- URL directa: `/Signup`
- Enlace desde la página de login: "¿No tienes una cuenta?"
- Punto de entrada del flujo de registro

## Estilos

### Diseño

- Diseño responsivo con flexbox
- Tema oscuro (`bg-[#161B22]`)
- Diseño dividido con secciones de formulario e imagen
- Enfoque mobile-first

### Elementos del Formulario

- Campos de entrada con estados de foco
- Selector de calendario para fecha de nacimiento
- Mensajes de error en rojo
- Mensajes de éxito en verde
- Estados de carga para botones

### Requisitos de Contraseña

- Lista compacta debajo del campo de contraseña
- Alineación de íconos y texto
- Retroalimentación codificada por colores
- Validación en tiempo real

### Diseño Visual

- Logo de UNEG prominentemente mostrado
- Interfaz limpia y moderna
- Esquema de colores consistente
- Tipografía profesional

## Accesibilidad

### Navegación por Teclado

- Todos los elementos del formulario son accesibles por teclado
- TabIndex configurado correctamente para alternancia de contraseña
- Navegación del calendario con teclado
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
- `lucide-react`: Íconos (Eye, EyeOff, Check, X, CalendarIcon)

### Dependencias de UI

- `@/components/ui/form`: Componentes de formulario
- `@/components/ui/input`: Componentes de entrada
- `@/components/ui/button`: Componentes de botón
- `@/components/ui/calendar`: Componente de calendario
- `@/components/ui/popover`: Componentes de popover
- `date-fns`: Formateo y manipulación de fechas

## Validación de Formularios

### Validación de Nombre

- Mínimo 2 caracteres
- Debe incluir nombre y apellido
- Recorta espacios en blanco automáticamente

### Validación de Email

- Formato de email válido
- Campo requerido
- Validación en tiempo real

### Validación de Fecha de Nacimiento

- Campo requerido
- Edad mínima de 16 años
- Interfaz de selector de calendario
- Selección de año con dropdown

### Validación de Contraseña

- Mínimo 8 caracteres
- Requisitos de mayúsculas y minúsculas
- Requisitos de caracteres especiales
- Verificación de requisitos en tiempo real

## Manejo de Errores

### Errores de Red

- Mensajes de error de conexión
- Funcionalidad de reintento
- Degradación elegante

### Errores de Validación

- Validación de formularios en tiempo real
- Mensajes de error específicos por campo
- Visualización clara de errores

### Errores de Registro

- Manejo de email duplicado
- Respuestas de error del servidor
- Mensajes de error amigables para el usuario

## Consideraciones de Seguridad

### Seguridad de Contraseña

- Alternancia de visibilidad de contraseña
- Manejo seguro de entrada
- Requisitos de contraseña fuertes
- Sin registro de contraseñas

### Validación de Datos

- Sanitización de entrada
- Verificación de edad
- Validación de formato de email
- Validación de formato de nombre

### Seguridad de API

- Endpoints seguros
- Validación de entrada
- Sanitización de mensajes de error

## Flujo de Registro

### Proceso de Registro

1. El usuario completa el formulario de registro
2. El formulario valida todas las entradas
3. Verificación de edad (mínimo 16)
4. Se envía solicitud a la API
5. Se crea la cuenta y el usuario es redirigido

### Escenarios de Error

- Datos de formulario inválidos
- Email duplicado
- Errores de red
- Errores del servidor

## Consideraciones de Pruebas

### Pruebas Unitarias

- Lógica de validación de formularios
- Verificaciones de requisitos de contraseña
- Gestión de estado
- Validación de fechas

### Pruebas de Integración

- Comunicación con API
- Flujo de registro
- Escenarios de error

### Pruebas E2E

- Flujo completo de registro
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

- Paso de verificación de email
- Integración de registro social
- Integración de CAPTCHA
- Medidor de fortaleza de contraseña
- Soporte multiidioma

### Mejoras de Seguridad

- Verificación de email
- Verificación de número de teléfono
- Autenticación de dos factores
- Limitación de tasa

## Componentes Relacionados

- `Login`: Autenticación de usuarios
- `RecoverPassword`: Recuperación de contraseña
- `Dashboard`: Destino post-registro

## Integración con API

### Formato de Solicitud

```typescript
{
  name: string;
  birthdate: Date;
  email: string;
  password: string;
}
```

### Formato de Respuesta

```typescript
{
  proceso: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
```

### Manejo de Errores

- Errores de red
- Errores de validación
- Errores de email duplicado
- Errores del servidor
