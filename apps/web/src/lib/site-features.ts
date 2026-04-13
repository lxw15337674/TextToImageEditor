import { BookOpenText, FileText, Layers3, Link2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { withLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getMessages as getLinkDiskMessages } from '@/linkdisk/i18n/messages';

type SiteFeatureGroupId = 'core' | 'more';
type SiteFeaturePin = 'left' | 'right' | 'none';

export interface SiteFeatureItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: SiteFeatureGroupId;
  match: string;
  matchMode?: 'exact' | 'prefix';
  pin: SiteFeaturePin;
  external?: boolean;
}

export interface SiteFeatureGroup {
  id: SiteFeatureGroupId;
  label: string;
  items: SiteFeatureItem[];
}

const GROUP_ORDER: SiteFeatureGroupId[] = ['core', 'more'];

export function getSiteFeatureGroups(locale: Locale): SiteFeatureGroup[] {
  const messages = getMessages(locale);
  const linkDiskMessages = getLinkDiskMessages(locale);
  const items: SiteFeatureItem[] = [
    {
      id: 'editor',
      label: messages.common.featureLabelWriteDeck,
      description: messages.common.featureDescriptionWriteDeck,
      href: withLocalePrefix('/writedeck', locale),
      icon: FileText,
      group: 'core',
      match: '/writedeck',
      matchMode: 'prefix',
      pin: 'left',
    },
    {
      id: 'use-cases',
      label: messages.common.featureLabelUseCases,
      description: messages.common.featureDescriptionUseCases,
      href: withLocalePrefix('/use-cases', locale),
      icon: Layers3,
      group: 'core',
      match: '/use-cases',
      matchMode: 'exact',
      pin: 'right',
    },
    {
      id: 'starter',
      label: messages.common.featureLabelStarter,
      description: messages.common.featureDescriptionStarter,
      href: withLocalePrefix('/starter', locale),
      icon: BookOpenText,
      group: 'more',
      match: '/starter',
      matchMode: 'prefix',
      pin: 'none',
    },
    {
      id: 'linkdisk',
      label: linkDiskMessages.common.featureLabelHome,
      description: linkDiskMessages.common.featureDescriptionHome,
      href: withLocalePrefix('/linkdisk', locale),
      icon: Link2,
      group: 'more',
      match: '/linkdisk',
      matchMode: 'prefix',
      pin: 'none',
    },
  ];

  const groupLabels: Record<SiteFeatureGroupId, string> = {
    core: messages.common.featureGroupCore,
    more: messages.common.featureGroupMore,
  };

  return GROUP_ORDER.map((groupId) => ({
    id: groupId,
    label: groupLabels[groupId],
    items: items.filter((item) => item.group === groupId),
  })).filter((group) => group.items.length > 0);
}

export function flattenSiteFeatureGroups(groups: SiteFeatureGroup[]): SiteFeatureItem[] {
  return groups.flatMap((group) => group.items);
}

export function isSiteFeatureActive(item: SiteFeatureItem, barePath: string) {
  if (item.matchMode === 'exact') {
    return barePath === item.match;
  }

  return barePath === item.match || barePath.startsWith(`${item.match}/`);
}
