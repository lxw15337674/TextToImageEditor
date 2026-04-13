import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getHtmlLang } from '@/i18n/locale-meta';
import { getMessages } from '@/i18n/messages';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

export const WRITEDECK_BASE_PATH = '/writedeck';
export const WRITEDECK_USE_CASES_PATH = `${WRITEDECK_BASE_PATH}/use-cases`;

export function createWriteDeckPageMetadata(locale: Locale): Metadata {
  const messages = getMessages(locale);

  return createMarketingMetadata({
    locale,
    pathname: WRITEDECK_BASE_PATH,
    title: messages.writedeck.metadataTitle,
    description: messages.writedeck.metadataDescription,
    siteName: messages.common.siteName,
  });
}

export function createWriteDeckUseCasesMetadata(locale: Locale): Metadata {
  const messages = getMessages(locale);

  return createMarketingMetadata({
    locale,
    pathname: WRITEDECK_USE_CASES_PATH,
    title: messages.writedeckUseCases.metadataTitle,
    description: messages.writedeckUseCases.metadataDescription,
    siteName: messages.common.siteName,
  });
}

export function buildWriteDeckHomeSeoGraph(locale: Locale) {
  const messages = getMessages(locale);
  const htmlLang = getHtmlLang(locale);
  const siteUrl = toAbsoluteUrl('/');
  const pageUrl = toAbsoluteUrl(`/${locale}${WRITEDECK_BASE_PATH}`);

  return [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: messages.common.siteName,
      inLanguage: htmlLang,
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${pageUrl}#app`,
      name: messages.common.navWriteDeck,
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web',
      url: pageUrl,
      description: messages.writedeck.metadataDescription,
      inLanguage: htmlLang,
      featureList: messages.writedeckUseCases.valueItems.map((item) => item.title),
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: messages.writedeck.metadataTitle,
      description: messages.writedeck.metadataDescription,
      isPartOf: {
        '@id': `${siteUrl}#website`,
      },
      about: {
        '@id': `${pageUrl}#app`,
      },
      inLanguage: htmlLang,
    },
  ];
}

export function buildWriteDeckUseCasesSeoGraph(locale: Locale) {
  const messages = getMessages(locale);
  const htmlLang = getHtmlLang(locale);
  const siteUrl = toAbsoluteUrl('/');
  const writeDeckUrl = toAbsoluteUrl(`/${locale}${WRITEDECK_BASE_PATH}`);
  const pageUrl = toAbsoluteUrl(`/${locale}${WRITEDECK_USE_CASES_PATH}`);

  return [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: messages.common.siteName,
      inLanguage: htmlLang,
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: messages.writedeckUseCases.metadataTitle,
      description: messages.writedeckUseCases.metadataDescription,
      isPartOf: {
        '@id': `${siteUrl}#website`,
      },
      about: {
        '@id': `${writeDeckUrl}#app`,
      },
      inLanguage: htmlLang,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: messages.common.navWriteDeck,
          item: writeDeckUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: messages.writedeckUseCases.metadataTitle,
          item: pageUrl,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      inLanguage: htmlLang,
      mainEntity: messages.writedeckUseCases.faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];
}
