import copy from '@data/i18n/nova.json';

export type NovaLocale = 'id' | 'en';

export function getNovaCopy(locale: NovaLocale = 'id') {
  return copy[locale] ?? copy.id ?? copy.en;
}

export function getNovaSectionCopy(locale: NovaLocale, dataKey?: string) {
  if (!dataKey) return undefined;
  const currentCopy = getNovaCopy(locale);
  return currentCopy.sections?.[dataKey as keyof typeof currentCopy.sections];
}

function withNovaBase(path: string): string {
  const configuredBase = process.env.PUBLIC_BASE_PATH || import.meta.env.BASE_URL;
  const base = configuredBase === '/'
    ? ''
    : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;
  return `${base}${path}` || '/';
}

export function getNovaLocalePath(locale: NovaLocale): string {
  return withNovaBase(locale === 'id' ? '/' : '/?lang=en');
}

export function getNovaNavigationPath(href: string, locale: NovaLocale): string {
  if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href;
  }

  const normalized = href.startsWith('/') ? href : `/${href}`;
  if (locale === 'id') return withNovaBase(normalized);
  return withNovaBase(`${normalized}?lang=en`);
}
