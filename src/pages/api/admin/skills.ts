import type { APIRoute } from 'astro';
import db from '@utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, id, name, level, category, icon } = data;

    if (action === 'create') {
      const insert = db.prepare('INSERT INTO skills (name, level, category, icon) VALUES (?, ?, ?, ?)');
      const res = insert.run(
        name || 'New Skill',
        Number(level) || 80,
        category || 'General',
        icon || 'ph-code'
      );
      return new Response(JSON.stringify({ success: true, id: res.lastInsertRowid }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update') {
      const update = db.prepare('UPDATE skills SET name = ?, level = ?, category = ?, icon = ? WHERE id = ?');
      update.run(
        name,
        Number(level) || 80,
        category,
        icon || 'ph-code',
        Number(id)
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      const del = db.prepare('DELETE FROM skills WHERE id = ?');
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
