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
      label: messages.common.openEditor,
      description: messages.common.featureDescriptionNotes,
      href: withLocalePrefix('/notes', locale),
      icon: FileText,
      group: 'core',
      match: '/notes',
      pin: 'left',
    },
    {
      id: 'use-cases',
      label: messages.common.navUseCases,
      description: messages.common.featureDescriptionUseCases,
      href: withLocalePrefix('/use-cases', locale),
      icon: Layers3,
      group: 'core',
      match: '/use-cases',
      pin: 'right',
    },
    {
      id: 'starter',
      label: messages.common.navStarter,
      description: messages.common.featureDescriptionStarter,
      href: withLocalePrefix('/starter', locale),
      icon: BookOpenText,
      group: 'more',
      match: '/starter',
      pin: 'none',
    },
    {
      id: 'linkdisk',
      label: linkDiskMessages.common.siteName,
      description: linkDiskMessages.common.featureDescriptionHome,
      href: withLocalePrefix('/linkdisk', locale),
      icon: Link2,
      group: 'more',
      match: '/linkdisk',
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
  if (item.id === 'use-cases') {
    return barePath === item.match || barePath.endsWith('/use-cases');
  }

  return barePath === item.match || barePath.startsWith(`${item.match}/`);
}
