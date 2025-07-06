import { 
  Home, 
  Trophy, 
  FolderOpen, 
  User,
  BarChart3
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  requiresAuth?: boolean;
}

// Rutas públicas (no requieren autenticación)
export const publicRoutes = [
  '/Login',
  '/Signup', 
  '/login',
  '/signup'
];

// Rutas protegidas (requieren autenticación)
export const protectedRoutes = [
  '/',
  '/Ranking',
  '/Proyecto', 
  '/Perfil',
  '/estadisticas'
];

// Configuración de navegación principal
export const navigationItems: NavItem[] = [
  {
    name: "Inicio",
    href: "/",
    icon: Home,
    description: "Página principal",
    requiresAuth: true
  },
  {
    name: "Ranking",
    href: "/Ranking",
    icon: Trophy,
    description: "Ranking de proyectos",
    requiresAuth: true
  },
  {
    name: "Proyectos",
    href: "/Proyecto",
    icon: FolderOpen,
    description: "Explorar proyectos",
    requiresAuth: true
  },
  {
    name: "Perfil",
    href: "/Perfil",
    icon: User,
    description: "Tu perfil de usuario",
    requiresAuth: true
  },
  {
    name: "Estadísticas",
    href: "/estadisticas",
    icon: BarChart3,
    description: "Estadísticas y análisis",
    requiresAuth: true
  }
];

// Función para verificar si una ruta es pública
export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname);
}

// Función para verificar si una ruta es protegida
export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.includes(pathname);
}

// Función para obtener elementos de navegación filtrados por autenticación
export function getNavigationItems(requireAuth: boolean = true): NavItem[] {
  return navigationItems.filter(item => 
    requireAuth ? item.requiresAuth : !item.requiresAuth
  );
}

// Función para obtener el elemento de navegación activo
export function getActiveNavItem(pathname: string): NavItem | null {
  return navigationItems.find(item => item.href === pathname) || null;
} 