import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type AppPageWidth = 'wide' | 'content' | 'narrow';

const APP_PAGE_WIDTH_CLASSNAMES: Record<AppPageWidth, string> = {
  wide: 'max-w-[92rem]',
  content: 'max-w-6xl',
  narrow: 'max-w-5xl',
};

interface AppPageContainerProps {
  as?: 'div' | 'main' | 'section';
  children: ReactNode;
  className?: string;
  padded?: boolean;
  width?: AppPageWidth;
}

interface SectionIntroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

interface PagePanelProps {
  as?: 'div' | 'section';
  children: ReactNode;
  className?: string;
}

export function AppPageContainer({
  as: Component = 'main',
  children,
  className,
  padded = true,
  width = 'wide',
}: AppPageContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto flex w-full flex-1 flex-col',
        APP_PAGE_WIDTH_CLASSNAMES[width],
        padded ? 'px-4 sm:px-6 lg:px-8' : null,
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: SectionIntroProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {typeof eyebrow === 'string' ? (
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]">
          {eyebrow}
        </Badge>
      ) : (
        eyebrow
      )}
      <div className="space-y-3">
        <div className={cn('text-4xl font-semibold tracking-tight text-foreground sm:text-5xl', titleClassName)}>{title}</div>
        {description ? (
          <div className={cn('max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg', descriptionClassName)}>
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function PagePanel({ as: Component = 'section', children, className }: PagePanelProps) {
  return <Component className={cn('rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm sm:p-8', className)}>{children}</Component>;
}
