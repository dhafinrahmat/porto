import { defineMiddleware } from 'astro:middleware';
import { getAuthenticatedAdmin } from './utils/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // 1. Standar Keamanan ISO/IEC/IEEE 23026:2023 - Security Headers
  // Proteksi Clickjacking, MIME Sniffing, XSS, Referrer Leak, & Restrictive Permissions
  const addSecurityHeaders = (response: Response): Response => {
    const headers = new Headers(response.headers);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    headers.set('X-XSS-Protection', '1; mode=block');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };

  // 2. Proteksi Akses CMS Admin & API Admin (Autentikasi Session ISO 23026)
  const isLoginPage = pathname === '/admin/login';
  const isLoginApi = pathname === '/api/admin/login';
  const isAdminRoute = pathname.startsWith('/admin') && !isLoginPage;
  const isAdminApiRoute = pathname.startsWith('/api/admin') && !isLoginApi;

  if (isAdminRoute || isAdminApiRoute) {
    const admin = getAuthenticatedAdmin(context.request);
    if (!admin) {
      if (isAdminApiRoute) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: Sesi admin tidak valid atau telah berakhir.' }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
              'WWW-Authenticate': 'Cookie',
            },
          }
        );
      }
      return context.redirect('/admin/login');
    }
  }

  // 3. Eksekusi Request & Penanganan Error Terkendali
  try {
    const response = await next();
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('[App Runtime Error caught by middleware]:', error);
    if (context.url.pathname.startsWith('/api')) {
      throw error;
    }
    if (!context.url.pathname.startsWith('/404')) {
      return context.redirect('/404');
    }
    return new Response('404 Not Found', { status: 404 });
  }
});
