import type { APIRoute } from 'astro';
import db from '@utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const updateStmt = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');

    db.exec('BEGIN');
    try {
      for (const [key, value] of Object.entries(data)) {
        updateStmt.run(key, String(value ?? ''));
      }
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }

    return new Response(JSON.stringify({ success: true, message: 'Settings saved successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
