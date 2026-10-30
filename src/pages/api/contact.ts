import type { APIRoute } from 'astro';
import db from '@utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    let data: any = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    const sanitize = (str: any) => String(str || '').replace(/[<>]/g, '').trim();

    const name = sanitize(data.name || data.fullName).slice(0, 100) || 'Anonymous';
    const email = sanitize(data.email).slice(0, 150) || 'no-email@example.com';
    const subject = sanitize(data.subject || data.service).slice(0, 200) || 'Portfolio Contact';
    const message = sanitize(data.message || data.body).slice(0, 3000) || '';

    // Validasi email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== 'no-email@example.com' && !emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Format alamat email tidak valid.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const insert = db.prepare('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)');
    insert.run(name, email, subject, message);

    return new Response(JSON.stringify({ success: true, message: 'Pesan Anda berhasil dikirim!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
