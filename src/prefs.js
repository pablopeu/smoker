// Persistencia de preferencias del usuario vía cookies.
// Hoy: idioma ('es' | 'en') y sistema de unidades ('imperial' | 'metric').
// SameSite=Lax, Path=/, Max-Age=1 año. Sin Secure para no romper el dev server (http).

const PREFIX = 'smokercalc.';
const MAX_AGE = 60 * 60 * 24 * 365; // 1 año (en segundos)

/** Lee una preferencia. Devuelve null si la cookie no existe. */
export function getPref(name) {
  const key = PREFIX + name + '=';
  const row = document.cookie.split('; ').find((c) => c.startsWith(key));
  return row ? decodeURIComponent(row.slice(key.length)) : null;
}

/** Guarda una preferencia en una cookie (1 año). */
export function setPref(name, value) {
  const v = encodeURIComponent(value);
  document.cookie = `${PREFIX}${name}=${v}; max-age=${MAX_AGE}; path=/; SameSite=Lax`;
}
