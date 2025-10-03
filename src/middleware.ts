import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que NO requieren autenticación
const publicRoutes = [
  '/auth',
  '/auth/login', 
  '/auth/register',
  '/auth/forgot-password'
];

// Rutas de API públicas
const publicApiRoutes = [
  '/api/auth',
  '/api/auth/login',
  '/api/auth/register'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`🔐 Middleware: Verificando ruta ${pathname}`);
  
  // Permitir acceso a archivos estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/logos') ||
    pathname.includes('.') // archivos con extensión
  ) {
    return NextResponse.next();
  }

  // Permitir API routes públicas
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Obtener y validar token de autenticación
  const token = request.cookies.get('auth-token')?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      // Verificación básica del token JWT (compatible con Edge Runtime)
      const parts = token.split('.');
      if (parts.length === 3) {
        // Decodificar el payload sin verificar la firma
        const payload = JSON.parse(atob(parts[1]));
        
        // Verificar que el token no haya expirado
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > now) {
          isAuthenticated = true;
        } else {
          // Token expirado
          isAuthenticated = false;
        }
      } else {
        // Token mal formado
        isAuthenticated = false;
      }
    } catch (error) {
      // Token inválido
      console.log('Token inválido o expirado:', error);
      isAuthenticated = false;
      
      // Limpiar cookie inválida solo si no estamos en ruta pública
      if (!isPublicRoute) {
        const response = NextResponse.redirect(new URL('/auth', request.url));
        response.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
        return response;
      }
    }
  }
  
  console.log(`🔐 Middleware: isAuthenticated=${isAuthenticated}, isPublicRoute=${isPublicRoute}, pathname=${pathname}`);

  // Si no está autenticado y no es ruta pública, redirigir a auth
  if (!isAuthenticated && !isPublicRoute) {
    console.log(`🔐 Middleware: Redirigiendo a /auth desde ${pathname}`);
    const authUrl = new URL('/auth', request.url);
    authUrl.searchParams.set('redirect', pathname); // Guardar página destino
    return NextResponse.redirect(authUrl);
  }
  
  // Si está autenticado y trata de acceder a auth, redirigir al dashboard
  if (isAuthenticated && isPublicRoute && pathname !== '/auth/logout') {
    return NextResponse.redirect(new URL('/rutinas', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas excepto:
     * - api routes que no requieren auth
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)  
     * - favicon.ico, robots.txt, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)',
  ],
}