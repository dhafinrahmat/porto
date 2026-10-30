import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const DB_PATH = path.resolve(process.cwd(), 'database.sqlite');
const db = new DatabaseSync(DB_PATH);

// Konfigurasi Keamanan & Performa Database (ISO/IEC/IEEE 23026:2023)
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
`);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS hero (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    eyebrow TEXT,
    heading TEXT,
    headingAccent TEXT,
    description TEXT,
    primaryCTA_label TEXT,
    primaryCTA_href TEXT,
    secondaryCTA_label TEXT,
    secondaryCTA_href TEXT,
    trustedBy TEXT,
    trustItems TEXT,
    stats TEXT,
    image TEXT,
    imageAlt TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    alt TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT,
    icon TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level INTEGER DEFAULT 80,
    category TEXT DEFAULT 'General',
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT,
    avatar TEXT,
    initials TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    author TEXT DEFAULT 'Finn',
    status TEXT DEFAULT 'published',
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    name TEXT DEFAULT 'Administrator',
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default data if empty
function seedIfEmpty() {
  const heroCount = db.prepare('SELECT count(*) as count FROM hero').get() as { count: number };
  if (heroCount.count === 0) {
    db.prepare(`
      INSERT INTO hero (
        id, eyebrow, heading, headingAccent, description,
        primaryCTA_label, primaryCTA_href, secondaryCTA_label, secondaryCTA_href,
        trustedBy, trustItems, stats, image, imageAlt
      ) VALUES (
        1,
        'FULL-STACK DEVELOPER / UI DESIGNER',
        'Crafting digital experiences for',
        'modern brands & tech',
        'Saya adalah Full-stack Developer dan UI/UX Designer yang berfokus menciptakan solusi web berkinerja tinggi, responsif, dan bernilai bisnis nyata.',
        'Lihat Portfolio', '#realizacje',
        'Hubungi Saya', '#contact',
        'Teknologi Favorit',
        json_array('React', 'Astro', 'TypeScript', 'Node.js', 'Tailwind', 'SQLite'),
        json_array(
          json_object('value', '15+', 'label', 'Proyek Selesai'),
          json_object('value', '3+', 'label', 'Tahun Pengalaman'),
          json_object('value', '100%', 'label', 'Komitmen Kualitas'),
          json_object('value', '24/7', 'label', 'Dukungan & Perawatan')
        ),
        '/assets/images/t001-nova/t001-nova-hero.webp',
        'Portfolio Hero Showcase'
      )
    `).run();
  }

  const projCount = db.prepare('SELECT count(*) as count FROM projects').get() as { count: number };
  if (projCount.count === 0) {
    const insertProj = db.prepare('INSERT INTO projects (title, category, image, alt, link, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
    insertProj.run('Modern E-Commerce Platform', 'Web Development', '/assets/images/t001-nova/t001-nova-project-laptop.webp', 'E-Commerce Platform', '#', 1);
    insertProj.run('Enterprise Dashboard & Analytics', 'UI/UX & SaaS', '/assets/images/t001-nova/t001-nova-project-building.webp', 'Dashboard Analytics', '#', 2);
    insertProj.run('Creative Portfolio & CMS', 'Full-stack System', '/assets/images/t001-nova/t001-nova-project-laptop.webp', 'Portfolio CMS', '#', 3);
  }

  const srvCount = db.prepare('SELECT count(*) as count FROM services').get() as { count: number };
  if (srvCount.count === 0) {
    const insertSrv = db.prepare('INSERT INTO services (number, icon, title, description, sort_order) VALUES (?, ?, ?, ?, ?)');
    insertSrv.run('01.', 'browser', 'Full-Stack Web Development', 'Membangun aplikasi web kencang dan skalabel menggunakan React, Astro, Node.js, dan database modern.', 1);
    insertSrv.run('02.', 'palette', 'UI/UX & Design Systems', 'Merancang antarmuka menawan, responsif, berstandar tinggi dengan Tailwind CSS, shadcn, dan prinsip desain konsisten.', 2);
    insertSrv.run('03.', 'database', 'Database & CMS Integration', 'Arsitektur database relasional seperti SQLite / PostgreSQL dengan panel kontrol kustom yang mudah dikelola.', 3);
    insertSrv.run('04.', 'rocket-launch', 'Performance & SEO Optimization', 'Optimasi Core Web Vitals, audit aksesibilitas WCAG, struktur SEO terindeks sempurna dan ultra cepat.', 4);
  }

  const skillCount = db.prepare('SELECT count(*) as count FROM skills').get() as { count: number };
  if (skillCount.count === 0) {
    const insertSkill = db.prepare('INSERT INTO skills (name, level, category, icon) VALUES (?, ?, ?, ?)');
    insertSkill.run('React 19 & Next.js', 95, 'Frontend', 'ph-code');
    insertSkill.run('Astro 7 & Tailwind CSS', 95, 'Frontend', 'ph-paint-brush');
    insertSkill.run('TypeScript & Node.js', 90, 'Full-Stack', 'ph-cpu');
    insertSkill.run('SQLite & Database Design', 85, 'Backend', 'ph-database');
    insertSkill.run('UI/UX Design & Figma', 88, 'Design', 'ph-palette');
  }

  const testCount = db.prepare('SELECT count(*) as count FROM testimonials').get() as { count: number };
  if (testCount.count === 0) {
    const insertTest = db.prepare('INSERT INTO testimonials (quote, author, role, avatar, initials, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
    insertTest.run('Hasil pengerjaan web sangat rapi, cepat, dan sistem dashboardnya sangat intuitif memudahkan tim kami mengupdate konten!', 'Budi Santoso', 'CEO, TechNusantara', 'https://i.pravatar.cc/150?u=budi', 'BS', 1);
    insertTest.run('Kombinasi kemampuan frontend dan backend yang luar biasa. Desain modern serta performa SEO langsung melonjak.', 'Siti Rahma', 'Product Manager', 'https://i.pravatar.cc/150?u=siti', 'SR', 2);
    insertTest.run('Sangat komunikatif dan detail. Proyek selesai tepat waktu dengan kualitas di atas ekspektasi.', 'Kevin Tan', 'Founder Startup', 'https://i.pravatar.cc/150?u=kevin', 'KT', 3);
  }

  const faqCount = db.prepare('SELECT count(*) as count FROM faqs').get() as { count: number };
  if (faqCount.count === 0) {
    const insertFaq = db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)');
    insertFaq.run('Teknologi apa saja yang Anda kuasai?', 'Saya ahli dalam ekosistem JavaScript/TypeScript (React, Astro, Next.js, Node.js), Tailwind CSS, SQLite, serta perancangan UI/UX profesional.', 1);
    insertFaq.run('Bagaimana cara mengedit konten website portfolio ini?', 'Website ini dilengkapi dashboard admin Sneat yang terintegrasi dengan database SQLite. Anda bisa mengedit hero, proyek, layanan, testimoni, FAQ, dan data profil langsung dari browser!', 2);
    insertFaq.run('Apakah website ini bisa dijalankan offline?', 'Tentu saja! Menggunakan server lokal Node.js dan SQLite yang mandiri tanpa perlu koneksi internet eksternal.', 3);
  }

  const settingCount = db.prepare('SELECT count(*) as count FROM site_settings').get() as { count: number };
  if (settingCount.count === 0) {
    const insertSet = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)');
    insertSet.run('site_title', 'Portfolio & CMS | Full-Stack Developer');
    insertSet.run('site_tagline', 'Modern Portfolio with Sneat Admin & SQLite');
    insertSet.run('owner_name', 'Finn');
    insertSet.run('owner_title', 'Full-Stack Developer & UI/UX Specialist');
    insertSet.run('owner_email', 'finn@example.com');
    insertSet.run('owner_phone', '+62 812-3456-7890');
    insertSet.run('owner_address', 'Jakarta / Bandung, Indonesia');
    insertSet.run('owner_bio', 'Passionate developer crafting robust web systems, combining cutting-edge design and modern full-stack architectures.');
    insertSet.run('social_github', 'https://github.com');
    insertSet.run('social_linkedin', 'https://linkedin.com');
    insertSet.run('social_twitter', 'https://twitter.com');
    insertSet.run('footer_about', 'Portfolio profesional interaktif ditenagai oleh Nova Astro & Sneat Dashboard dengan database SQLite.');
  }

  const postCount = db.prepare('SELECT count(*) as count FROM posts').get() as { count: number };
  if (postCount.count === 0) {
    const insertPost = db.prepare(`
      INSERT INTO posts (title, slug, category, excerpt, content, image, author, status, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertPost.run(
      'Membangun Arsitektur Web Modern dengan Astro & SQLite',
      'membangun-arsitektur-web-modern-dengan-astro-sqlite',
      'Teknologi',
      'Panduan lengkap merancang situs berkinerja tinggi, zero-bundle javascript, dan basis data mandiri offline.',
      'Astro v5 membawa banyak terobosan baru dalam arsitektur website modern...',
      '/assets/images/t001-nova/t001-nova-project-laptop.webp',
      'Finn',
      'published',
      1240
    );
    insertPost.run(
      'Tips Optimasi Performa Mobile & Core Web Vitals',
      'tips-optimasi-performa-mobile-core-web-vitals',
      'Performance',
      'Bagaimana cara mencapai skor 100 di PageSpeed dan menjaga animasi tetap stabil 60 FPS pada perangkat seluler.',
      'Performa di perangkat seluler sering kali terkendala oleh ukuran aset gambar yang terlalu besar...',
      '/assets/images/t001-nova/t001-nova-project-building.webp',
      'Finn',
      'published',
      856
    );
    insertPost.run(
      'Integrasi UI Kit Sneat & SQLite pada Node.js SSR',
      'integrasi-ui-kit-sneat-sqlite-pada-nodejs-ssr',
      'Development',
      'Kombinasi efisien dashboard open-source dengan node:sqlite native tanpa dependensi eksternal.',
      'Menggunakan database bawaan Node.js 22 memberikan keunggulan kecepatan dan kemudahan deployment...',
      '/assets/images/t001-nova/t001-nova-project-laptop.webp',
      'Finn',
      'published',
      620
    );
  }

  // Seed default admin user if empty
  const userCount = db.prepare('SELECT count(*) as count FROM admin_users').get() as { count: number };
  if (userCount.count === 0) {
    // Password default aman: admin / admin123 (PBKDF2 SHA-512 with random salt)
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('admin123', salt, 100000, 64, 'sha512').toString('hex');
    db.prepare(`
      INSERT INTO admin_users (username, password_hash, salt, name, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin', hash, salt, 'Administrator Finn', 'admin');
  }
}

seedIfEmpty();

export { db };
export default db;
