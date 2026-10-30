import type { APIRoute } from 'astro';
import db from '@utils/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY id DESC').all();
    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, id } = data;

    if (action === 'delete') {
      const del = db.prepare('DELETE FROM messages WHERE id = ?');
      del.run(Number(id));
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
