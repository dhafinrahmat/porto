import type { APIRoute } from 'astro';
import db from '@utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, id, question, answer, sort_order } = data;

    if (action === 'create') {
      const insert = db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)');
      const res = insert.run(
        question || 'Question?',
        answer || 'Answer here...',
        Number(sort_order) || 0
      );
      return new Response(JSON.stringify({ success: true, id: res.lastInsertRowid }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update') {
      const update = db.prepare('UPDATE faqs SET question = ?, answer = ?, sort_order = ? WHERE id = ?');
      update.run(
        question,
        answer,
        Number(sort_order) || 0,
        Number(id)
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      const del = db.prepare('DELETE FROM faqs WHERE id = ?');
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
