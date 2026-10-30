import type { APIRoute } from 'astro';
import db from '@utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, id, title, category, image, alt, link, sort_order } = data;

    if (action === 'create') {
      const insert = db.prepare('INSERT INTO projects (title, category, image, alt, link, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
      const res = insert.run(
        title || 'New Project',
        category || 'Web',
        image || '/assets/images/t001-nova/t001-nova-project-laptop.webp',
        alt || title || 'Project Preview',
        link || '#',
        Number(sort_order) || 0
      );
      return new Response(JSON.stringify({ success: true, id: res.lastInsertRowid }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update') {
      const update = db.prepare('UPDATE projects SET title = ?, category = ?, image = ?, alt = ?, link = ?, sort_order = ? WHERE id = ?');
      update.run(
        title,
        category,
        image || '/assets/images/t001-nova/t001-nova-project-laptop.webp',
        alt || title,
        link || '#',
        Number(sort_order) || 0,
        Number(id)
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      const del = db.prepare('DELETE FROM projects WHERE id = ?');
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
