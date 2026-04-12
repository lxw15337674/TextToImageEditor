import { resolveLocaleForMetadata } from '@/lib/route-locale';
import {
  createPageSocialImage,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
} from '@/lib/seo/page-social-image';
import { getUseCasesPageCopy } from '@/linkdisk/lib/seo/marketing-pages';

export const alt = SOCIAL_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = SOCIAL_IMAGE_CONTENT_TYPE;

interface OpenGraphImageProps {
  params: Promise<{ locale: string }>;
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocaleForMetadata(requestedLocale);
  const copy = getUseCasesPageCopy(locale);

  return createPageSocialImage({
    locale,
    siteName: 'LinkDisk',
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    tags: [copy.eyebrow, copy.strengthsTitle, copy.scenariosTitle],
  });
}
