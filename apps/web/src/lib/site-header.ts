import type { Locale } from '@/i18n/config';
import { withLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getMessages as getLinkDiskMessages } from '@/linkdisk/i18n/messages';
import { flattenSiteFeatureGroups, getSiteFeatureGroups, type SiteFeatureItem } from '@/lib/site-features';

const LAUNCHER_FEATURE_IDS = new Set(['editor', 'linkdisk']);

export interface HeaderBrandConfig {
  href: string;
  label: string;
}

export type SiteHeaderLeftArea =
  | {
      kind: 'brand';
    }
  | {
      href: string;
      kind: 'brand-label';
      label: string;
    };

export interface SiteHeaderConfig {
  brand: HeaderBrandConfig;
  launcherItems: SiteFeatureItem[];
  leftArea: SiteHeaderLeftArea;
  quickActions: SiteFeatureItem[];
}

function isSiteFeatureItem(item: SiteFeatureItem | null): item is SiteFeatureItem {
  return item !== null;
}

function resolveUseCasesQuickAction(locale: Locale, barePath: string, item: SiteFeatureItem): SiteFeatureItem | null {
  if (barePath === '/') {
    return null;
  }

  if (barePath === '/writedeck' || barePath.startsWith('/writedeck/')) {
    return {
      ...item,
      href: withLocalePrefix('/writedeck/use-cases', locale),
      match: '/writedeck/use-cases',
      matchMode: 'exact',
    };
  }

  if (barePath === '/linkdisk' || barePath.startsWith('/linkdisk/')) {
    return {
      ...item,
      href: withLocalePrefix('/linkdisk/use-cases', locale),
      match: '/linkdisk/use-cases',
      matchMode: 'exact',
    };
  }

  return item;
}

function resolveLeftArea(locale: Locale, barePath: string): SiteHeaderLeftArea {
  const messages = getMessages(locale);
  const linkDiskMessages = getLinkDiskMessages(locale);

  if (barePath === '/writedeck' || barePath.startsWith('/writedeck/')) {
    return {
      kind: 'brand-label',
      label: messages.common.featureLabelWriteDeck,
      href: withLocalePrefix('/writedeck', locale),
    };
  }

  if (barePath === '/linkdisk' || barePath.startsWith('/linkdisk/')) {
    return {
      kind: 'brand-label',
      label: linkDiskMessages.common.featureLabelHome,
      href: withLocalePrefix('/linkdisk', locale),
    };
  }

  if (barePath === '/use-cases') {
    return {
      kind: 'brand-label',
      label: messages.common.featureLabelUseCases,
      href: withLocalePrefix('/use-cases', locale),
    };
  }

  if (barePath === '/starter' || barePath.startsWith('/starter/')) {
    return {
      kind: 'brand-label',
      label: messages.common.featureLabelStarter,
      href: withLocalePrefix('/starter', locale),
    };
  }

  return {
    kind: 'brand',
  };
}

export function getSiteHeaderConfig(locale: Locale, barePath: string): SiteHeaderConfig {
  const allGroups = getSiteFeatureGroups(locale);
  const allItems = flattenSiteFeatureGroups(allGroups);
  const launcherItems = allItems.filter((item) => LAUNCHER_FEATURE_IDS.has(item.id));

  return {
    brand: {
      href: withLocalePrefix('/', locale),
      label: getMessages(locale).common.siteName,
    },
    launcherItems,
    leftArea: resolveLeftArea(locale, barePath),
    quickActions: allItems
      .filter((item) => item.pin === 'right')
      .map((item) => (item.id === 'use-cases' ? resolveUseCasesQuickAction(locale, barePath, item) : item))
      .filter(isSiteFeatureItem),
  };
}
