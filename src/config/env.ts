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