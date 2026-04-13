import type { HTMLAttributes, ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type AppPageWidth = 'wide' | 'content' | 'narrow';
type AppPageVariant = 'marketing' | 'workspace';
type PageSectionSpacing = 'none' | 'sm' | 'md';

const APP_PAGE_WIDTH_CLASSNAMES: Record<AppPageWidth, string> = {
  wide: 'max-w-[92rem]',
  content: 'max-w-6xl',
  narrow: 'max-w-5xl',
};

const APP_PAGE_VARIANT_CLASSNAMES: Record<AppPageVariant, string> = {
  marketing: 'gap-8 py-8 sm:py-10 lg:gap-10',
  workspace: 'min-h-0 gap-4 py-4 sm:gap-6',
};

const PAGE_SECTION_SPACING_CLASSNAMES: Record<PageSectionSpacing, string> = {
  none: '',
  sm: 'space-y-3',
  md: 'space-y-4',
};

interface AppPageContainerProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'main' | 'section';
  children: ReactNode;
  padded?: boolean;
  variant?: AppPageVariant;
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

interface PageSectionProps {
  as?: 'div' | 'section';
  children: ReactNode;
  className?: string;
  id?: string;
  spacing?: PageSectionSpacing;
}

interface WorkspaceSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AppPageContainer({
  as: Component = 'main',
  children,
  className,
  padded = true,
  variant = 'marketing',
  width = 'wide',
  ...props
}: AppPageContainerProps) {
  return (
    <Component
      {...props}
      className={cn(
        'mx-auto flex w-full flex-1 flex-col',
        APP_PAGE_WIDTH_CLASSNAMES[width],
        APP_PAGE_VARIANT_CLASSNAMES[variant],
        padded ? 'px-4 sm:px-6 lg:px-8 py-8 sm:py-10 ' : null,
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

export function PageSection({ as: Component = 'section', children, className, id, spacing = 'md' }: PageSectionProps) {
  return (
    <Component id={id} className={cn(PAGE_SECTION_SPACING_CLASSNAMES[spacing], className)}>
      {children}
    </Component>
  );
}

export function PagePanel({ as: Component = 'section', children, className }: PagePanelProps) {
  return <Component className={cn('rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm sm:p-8', className)}>{children}</Component>;
}

export function WorkspaceSurface({ children, className, ...props }: WorkspaceSurfaceProps) {
  return (
    <div
      {...props}
      className={cn('isolate flex min-h-0 w-full flex-1 overflow-hidden rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm', className)}
    >
      {children}
    </div>
  );
}
