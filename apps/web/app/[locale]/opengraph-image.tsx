import { hasLocale } from 'next-intl';
import { getMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import {
  createPageSocialImage,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
} from '@/lib/seo/page-social-image';

export const alt = SOCIAL_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = SOCIAL_IMAGE_CONTENT_TYPE;

interface OpenGraphImageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(input: string) {
  return hasLocale(routing.locales, input) ? input : routing.defaultLocale;
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);
  const messages = getMessages(locale);

  return createPageSocialImage({
    locale,
    siteName: messages.common.siteName,
    title: messages.useCasesHub.metadataTitle,
    description: messages.useCasesHub.metadataDescription,
    tags: [messages.common.navUseCases, messages.useCasesHub.writedeckTitle, messages.useCasesHub.linkdiskTitle],
  });
}
