import type { APIRoute } from 'astro';
import db from '@utils/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const {
      site_logo_text,
      nav_cta_label,
      eyebrow,
      heading,
      headingAccent,
      description,
      primaryCTA_label,
      primaryCTA_href,
      secondaryCTA_label,
      secondaryCTA_href,
      trustedBy,
      trustItems,
      stats,
      image,
      imageAlt,
    } = data;

    // Simpan logo dan CTA jika ada
    if (site_logo_text !== undefined) {
      db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run('site_logo_text', String(site_logo_text));
    }
    if (nav_cta_label !== undefined) {
      db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run('nav_cta_label', String(nav_cta_label));
    }

    const trustItemsJson = typeof trustItems === 'string' ? trustItems : JSON.stringify(trustItems || []);
    const statsJson = typeof stats === 'string' ? stats : JSON.stringify(stats || []);

    const update = db.prepare(`
      UPDATE hero SET
        eyebrow = ?,
        heading = ?,
        headingAccent = ?,
        description = ?,
        primaryCTA_label = ?,
        primaryCTA_href = ?,
        secondaryCTA_label = ?,
        secondaryCTA_href = ?,
        trustedBy = ?,
        trustItems = ?,
        stats = ?,
        image = ?,
        imageAlt = ?
      WHERE id = 1
    `);

    update.run(
      eyebrow || '',
      heading || '',
      headingAccent || '',
      description || '',
      primaryCTA_label || '',
      primaryCTA_href || '',
      secondaryCTA_label || '',
      secondaryCTA_href || '',
      trustedBy || '',
      trustItemsJson,
      statsJson,
      image || '/assets/images/t001-nova/t001-nova-hero.webp',
      imageAlt || 'Hero Image'
    );

    return new Response(JSON.stringify({ success: true, message: 'Hero section updated successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
