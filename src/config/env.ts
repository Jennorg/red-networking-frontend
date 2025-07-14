// Environment configuration
export const env = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://red-networking-backend.vercel.app/api',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  PAGINA_PRINCIPAL: `${env.API_BASE_URL}/pagina_principal`,
  // User favorites endpoints
  USER_FAVORITES: (userId: string) => `${env.API_BASE_URL}/users/${userId}/favorites`,
  USER_FAVORITE_PROJECT: (userId: string, projectId: string) => `${env.API_BASE_URL}/users/${userId}/favorites/${projectId}`,
  // User projects endpoint
  USER_PROJECTS: (userId: string) => `${env.API_BASE_URL}/usuario_projects/${userId}`,
  // Alternative favorites endpoints (in case the above don't work)
  FAVORITES_ALT: `${env.API_BASE_URL}/favorites`,
  FAVORITE_PROJECT_ALT: (projectId: string) => `${env.API_BASE_URL}/favorites/${projectId}`,
  // Project comments endpoint
  PROJECT_COMMENTS: (projectId: string) => `${env.API_BASE_URL}/projects/${projectId}/comentarios`,
  // Project details endpoint
  PROJECT_DETAILS: (projectId: string) => `${env.API_BASE_URL}/projects/${projectId}`,
  // User management endpoints
  USERS_LIST: `${env.API_BASE_URL}/auth/users`,
  USER_ROLE_CHANGE: (userId: string) => `${env.API_BASE_URL}/users/${userId}/cambiar-rol`,
  // Project submission endpoint
  PROJECT_SUBMISSION: `${env.API_BASE_URL}/subida_proyecto`,
  // Auth endpoints
  AUTH_LOGIN: `${env.API_BASE_URL.replace('/api', '')}/auth/login`,
  AUTH_REGISTER: `${env.API_BASE_URL.replace('/api', '')}/auth/register`,
  // Add more endpoints here as needed
} as const;

// Validation function to ensure required environment variables are set
export function validateEnvironment() {
  const requiredVars = [
    'NEXT_PUBLIC_API_BASE_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Using fallback values. Please check your .env.local file.');
  }
}

// Call validation on module load
if (typeof window === 'undefined') {
  validateEnvironment();
} 