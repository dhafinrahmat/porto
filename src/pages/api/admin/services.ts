import type { APIRoute } from 'astro';
import db from '@utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, id, number, icon, title, description, sort_order } = data;

    if (action === 'create') {
      const insert = db.prepare('INSERT INTO services (number, icon, title, description, sort_order) VALUES (?, ?, ?, ?, ?)');
      const res = insert.run(
        number || '01.',
        icon || 'browser',
        title || 'Service Title',
        description || 'Service Description',
        Number(sort_order) || 0
      );
      return new Response(JSON.stringify({ success: true, id: res.lastInsertRowid }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update') {
      const update = db.prepare('UPDATE services SET number = ?, icon = ?, title = ?, description = ?, sort_order = ? WHERE id = ?');
      update.run(
        number,
        icon || 'browser',
        title,
        description,
        Number(sort_order) || 0,
        Number(id)
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      const del = db.prepare('DELETE FROM services WHERE id = ?');
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
