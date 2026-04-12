import type { Locale } from '@/i18n/config';
import { withLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { flattenSiteFeatureGroups, getSiteFeatureGroups, type SiteFeatureGroup, type SiteFeatureItem } from '@/lib/site-features';

const LAUNCHER_FEATURE_IDS = new Set(['editor', 'linkdisk']);

export interface HeaderBrandConfig {
  href: string;
  label: string;
}

export interface SiteHeaderConfig {
  brand: HeaderBrandConfig;
  launcherGroups: SiteFeatureGroup[];
  primaryAction: SiteFeatureItem | null;
  quickActions: SiteFeatureItem[];
}

export function getSiteHeaderConfig(locale: Locale): SiteHeaderConfig {
  const commonMessages = getMessages(locale).common;
  const allGroups = getSiteFeatureGroups(locale);
  const allItems = flattenSiteFeatureGroups(allGroups);
  const launcherItems = allItems.filter((item) => LAUNCHER_FEATURE_IDS.has(item.id));
  const launcherGroups: SiteFeatureGroup[] = launcherItems.length
    ? [
        {
          id: 'core',
          label: commonMessages.featureLauncher,
          items: launcherItems,
        },
      ]
    : [];

  return {
    brand: {
      href: withLocalePrefix('/', locale),
      label: commonMessages.siteName,
    },
    launcherGroups,
    primaryAction: launcherItems.find((item) => item.pin === 'left') ?? null,
    quickActions: allItems.filter((item) => item.pin === 'right'),
  };
}
