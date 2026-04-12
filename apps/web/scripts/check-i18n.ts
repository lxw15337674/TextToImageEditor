import { ALL_LOCALES, DEFAULT_LOCALE, type Locale } from '../src/i18n/config';
import { enMessages } from '../src/i18n/locales/en';
import { esMessages } from '../src/i18n/locales/es';
import { jaMessages } from '../src/i18n/locales/ja';
import { zhMessages } from '../src/i18n/locales/zh';
import type { LocaleMessages } from '../src/i18n/messages.types';

const localeMessages = {
  en: enMessages,
  zh: zhMessages,
  es: esMessages,
  ja: jaMessages,
} as const satisfies Record<Locale, LocaleMessages>;

function getValueKind(value: unknown): 'array' | 'object' | 'primitive' {
  if (Array.isArray(value)) return 'array';
  if (value !== null && typeof value === 'object') return 'object';
  return 'primitive';
}

function compareShape(baseValue: unknown, targetValue: unknown, path: string, issues: string[]) {
  const baseKind = getValueKind(baseValue);
  const targetKind = getValueKind(targetValue);

  if (baseKind !== targetKind) {
    issues.push(`${path}: expected ${baseKind}, received ${targetKind}`);
    return;
  }

  if (baseKind === 'primitive') {
    if (typeof baseValue !== typeof targetValue) {
      issues.push(`${path}: expected ${typeof baseValue}, received ${typeof targetValue}`);
    }
    return;
  }

  if (baseKind === 'array') {
    const baseArray = baseValue as unknown[];
    const targetArray = targetValue as unknown[];

    if (baseArray.length !== targetArray.length) {
      issues.push(`${path}: expected array length ${baseArray.length}, received ${targetArray.length}`);
    }

    const limit = Math.min(baseArray.length, targetArray.length);
    for (let index = 0; index < limit; index += 1) {
      compareShape(baseArray[index], targetArray[index], `${path}[${index}]`, issues);
    }
    return;
  }

  const baseObject = baseValue as Record<string, unknown>;
  const targetObject = targetValue as Record<string, unknown>;

  for (const key of Object.keys(baseObject)) {
    const nextPath = path ? `${path}.${key}` : key;
    if (!(key in targetObject)) {
      issues.push(`${nextPath}: missing key`);
      continue;
    }
    compareShape(baseObject[key], targetObject[key], nextPath, issues);
  }

  for (const key of Object.keys(targetObject)) {
    if (!(key in baseObject)) {
      const nextPath = path ? `${path}.${key}` : key;
      issues.push(`${nextPath}: unexpected key`);
    }
  }
}

function main() {
  const baseMessages = localeMessages[DEFAULT_LOCALE];
  const targetLocales = ALL_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);
  const issuesByLocale = new Map<Locale, string[]>();

  for (const locale of targetLocales) {
    const issues: string[] = [];
    compareShape(baseMessages, localeMessages[locale], '', issues);
    if (issues.length > 0) {
      issuesByLocale.set(locale, issues);
    }
  }

  if (issuesByLocale.size > 0) {
    console.error(`i18n shape check failed against base locale "${DEFAULT_LOCALE}".`);

    for (const [locale, issues] of issuesByLocale) {
      console.error(`\n[${locale}]`);
      for (const issue of issues) {
        console.error(`- ${issue}`);
      }
    }

    process.exitCode = 1;
    return;
  }

  process.stdout.write(`i18n shape check passed for ${targetLocales.join(', ')} against ${DEFAULT_LOCALE}.\n`);
}

main();
