import type { APIRoute } from 'astro';
import { db } from '@/utils/db';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/utils/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username dan password wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Query admin user (menggunakan prepared statement SQLite aman dari SQL Injection)
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username.trim()) as any;

    if (!user) {
      return new Response(JSON.stringify({ error: 'Kredensial login tidak valid.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Kredensial login tidak valid.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Buat token sesi terenkripsi HMAC SHA-256
    const token = createSessionToken({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    // Set cookie HttpOnly, SameSite=Strict, Path=/
    const isProd = process.env.NODE_ENV === 'production';
    const cookieFlags = [
      `${SESSION_COOKIE_NAME}=${token}`,
      'Path=/',
      `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
      'HttpOnly',
      'SameSite=Strict',
      isProd ? 'Secure' : '',
    ].filter(Boolean).join('; ');

    return new Response(JSON.stringify({ success: true, redirect: '/admin' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieFlags,
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Terjadi kesalahan internal server.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
