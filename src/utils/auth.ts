import crypto from 'node:crypto';
import { db } from './db';

const SESSION_COOKIE_NAME = 'porto_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'porto-secure-auth-secret-key-23026-2023-iso-compliant';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 jam

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

// PBKDF2 Password Hashing (Standar NIST SP 800-132 & ISO/IEC/IEEE 23026:2023)
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculatedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(calculatedHash, 'hex'), Buffer.from(hash, 'hex'));
}

// Generate HMAC Signed Session Token
export function createSessionToken(user: AdminUser): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = JSON.stringify({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    exp: expiresAt,
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

// Verify Session Token
export function verifySessionToken(token: string): AdminUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
    
    // Cegah timing attack
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token kedaluwarsa
    }

    return {
      id: payload.id,
      username: payload.username,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

// Helper untuk memeriksa sesi admin aktif dari Request / Cookie
export function getAuthenticatedAdmin(request: Request): AdminUser | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) return null;

  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
