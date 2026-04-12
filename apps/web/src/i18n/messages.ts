import type { Locale } from '@/i18n/config';
import { enMessages } from '@/i18n/locales/en';
import { esMessages } from '@/i18n/locales/es';
import { jaMessages } from '@/i18n/locales/ja';
import { zhMessages } from '@/i18n/locales/zh';
import type { LocaleMessages } from '@/i18n/messages.types';

const MESSAGES: Record<Locale, LocaleMessages> = {
  en: enMessages,
  zh: zhMessages,
  es: esMessages,
  ja: jaMessages,
};

export type { LocaleMessages } from '@/i18n/messages.types';

export function getMessages(locale: Locale): LocaleMessages {
  return MESSAGES[locale];
}
