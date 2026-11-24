// Open or seal the private source of the locked talk (case-study/source.enc). The password is read from CS_PW in the
// environment and never written anywhere. Same scheme as the talk's gate: PBKDF2-SHA256 600,000 rounds, AES-GCM.
//   CS_PW=... node source.mjs open  <out-dir>        -> writes <out-dir>/src.tgz (then: tar -xzf src.tgz)
//   CS_PW=... node source.mjs seal  <src.tgz>        -> writes case-study/source.enc
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { webcrypto as c } from 'crypto';
import { fileURLToPath } from 'url';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url)), enc = path.join(here, '../../case-study/source.enc');
const [cmd, arg] = process.argv.slice(2), pw = process.env.CS_PW;
if (!pw || !['open', 'seal'].includes(cmd) || !arg) { console.log('usage: CS_PW=... node source.mjs open <dir> | seal <src.tgz>'); process.exit(1); }
const keyFor = async salt => { const base = await c.subtle.importKey('raw', new TextEncoder().encode(pw.normalize('NFC')), 'PBKDF2', false, ['deriveBits']);
  const bits = await c.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 600000 }, base, 256); return c.subtle.importKey('raw', bits, 'AES-GCM', false, ['encrypt', 'decrypt']); };
if (cmd === 'seal') {
  const salt = c.getRandomValues(new Uint8Array(16)), iv = c.getRandomValues(new Uint8Array(12));
  const ct = Buffer.from(await c.subtle.encrypt({ name: 'AES-GCM', iv }, await keyFor(salt), readFileSync(arg)));
  writeFileSync(enc, Buffer.concat([Buffer.from(salt), Buffer.from(iv), ct])); console.log('sealed', ct.length, 'bytes ->', enc);
} else {
  const raw = readFileSync(enc), salt = raw.subarray(0, 16), iv = raw.subarray(16, 28), data = raw.subarray(28);
  const plain = Buffer.from(await c.subtle.decrypt({ name: 'AES-GCM', iv }, await keyFor(salt), data));
  mkdirSync(arg, { recursive: true }); writeFileSync(path.join(arg, 'src.tgz'), plain); console.log('opened ->', path.join(arg, 'src.tgz'));
}
