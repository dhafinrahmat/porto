import type { APIRoute } from 'astro';
import db from '@utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, id, quote, author, role, avatar, initials, sort_order } = data;

    if (action === 'create') {
      const insert = db.prepare('INSERT INTO testimonials (quote, author, role, avatar, initials, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
      const res = insert.run(
        quote || '',
        author || 'Anonymous',
        role || 'Client',
        avatar || 'https://i.pravatar.cc/150?u=user',
        initials || 'CL',
        Number(sort_order) || 0
      );
      return new Response(JSON.stringify({ success: true, id: res.lastInsertRowid }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update') {
      const update = db.prepare('UPDATE testimonials SET quote = ?, author = ?, role = ?, avatar = ?, initials = ?, sort_order = ? WHERE id = ?');
      update.run(
        quote,
        author,
        role,
        avatar || 'https://i.pravatar.cc/150?u=user',
        initials || 'CL',
        Number(sort_order) || 0,
        Number(id)
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      const del = db.prepare('DELETE FROM testimonials WHERE id = ?');
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
