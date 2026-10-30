import type { APIRoute } from 'astro';
import { SESSION_COOKIE_NAME } from '@/utils/auth';

export const POST: APIRoute = async () => {
  const isProd = process.env.NODE_ENV === 'production';
  const expireCookie = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    'SameSite=Strict',
    isProd ? 'Secure' : '',
  ].filter(Boolean).join('; ');

  return new Response(JSON.stringify({ success: true, redirect: '/admin/login' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': expireCookie,
    },
  });
};
