import * as crypto from 'crypto';

const ALGO = 'aes-256-gcm';

export function encrypt(text: string, secret: string) {
  const iv = crypto.randomBytes(16); // IV wajib 16 byte untuk CBC
  const key = crypto.createHash('sha256').update(secret).digest();

  const cipher = crypto.createCipheriv(ALGO, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);

  // gabungkan iv + data
  return `${iv.toString('base64')}.${encrypted.toString('base64')}`;
}

export function decrypt(payload: string, secret: string) {
  const [ivB64, encB64] = payload.split('.');

  const iv = Buffer.from(ivB64, 'base64');
  const encrypted = Buffer.from(encB64, 'base64');

  const key = crypto.createHash('sha256').update(secret).digest();

  const decipher = crypto.createDecipheriv(ALGO, key, iv);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}

export function hashApiKey(payload) {
  return crypto.createHash("sha256").update(payload).digest("hex");
}
