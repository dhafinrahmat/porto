import type { APIRoute } from 'astro';
import db from '@utils/db';

export const prerender = false;

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const GET: APIRoute = async () => {
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY id DESC').all();
    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, id, title, slug, category, excerpt, content, image, author, status, views } = data;

    if (action === 'create') {
      const finalSlug = (slug && slug.trim() !== '') ? generateSlug(slug) : generateSlug(title || 'post-' + Date.now());
      const insert = db.prepare(`
        INSERT INTO posts (title, slug, category, excerpt, content, image, author, status, views)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const res = insert.run(
        title || 'Artikel Baru',
        finalSlug,
        category || 'Teknologi',
        excerpt || '',
        content || '',
        image || '/assets/images/t001-nova/t001-nova-project-laptop.webp',
        author || 'Finn',
        status || 'published',
        Number(views) || 0
      );
      return new Response(JSON.stringify({ success: true, id: res.lastInsertRowid }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update') {
      const finalSlug = (slug && slug.trim() !== '') ? generateSlug(slug) : generateSlug(title || 'post-' + id);
      const update = db.prepare(`
        UPDATE posts
        SET title = ?, slug = ?, category = ?, excerpt = ?, content = ?, image = ?, author = ?, status = ?, views = ?
        WHERE id = ?
      `);
      update.run(
        title,
        finalSlug,
        category || 'Teknologi',
        excerpt || '',
        content || '',
        image || '/assets/images/t001-nova/t001-nova-project-laptop.webp',
        author || 'Finn',
        status || 'published',
        Number(views) || 0,
        Number(id)
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      const del = db.prepare('DELETE FROM posts WHERE id = ?');
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
