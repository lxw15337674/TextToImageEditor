'use client';

import { FilterCombobox } from '@/components/ui/filter-combobox';
import type { ExportTemplate } from '@/lib/editor/types';

export interface TemplateSelectorOption {
  value: ExportTemplate;
  label: string;
  keywords?: string[];
  group?: string;
  aliases?: string[];
}

interface TemplateSelectorProps {
  options: readonly TemplateSelectorOption[];
  value: ExportTemplate;
  placeholder: string;
  emptyText: string;
  clearLabel?: string;
  disabled?: boolean;
  onValueChange: (value: ExportTemplate) => void;
}

function buildTemplateKeywords(option: TemplateSelectorOption) {
  return [
    option.value,
    option.group,
    ...(option.aliases ?? []),
    ...(option.keywords ?? []),
  ].filter((keyword): keyword is string => Boolean(keyword?.trim()));
}

export function TemplateSelector({
  options,
  value,
  placeholder,
  emptyText,
  clearLabel,
  disabled = false,
  onValueChange,
}: TemplateSelectorProps) {
  const comboboxOptions = options.map((option) => ({
    value: option.value,
    label: option.label,
    keywords: buildTemplateKeywords(option),
  }));

  return (
    <FilterCombobox
      options={comboboxOptions}
      value={value}
      placeholder={placeholder}
      emptyText={emptyText}
      clearLabel={clearLabel}
      disabled={disabled}
      inputClassName="h-11 rounded-lg border-border/60 bg-background/50 text-sm"
      contentClassName="rounded-lg border-border/60 bg-popover/95 backdrop-blur-md shadow-xl"
      listClassName="max-h-72"
      itemClassName="rounded-md px-3 py-2 text-sm"
      onValueChange={(nextValue) => onValueChange(nextValue as ExportTemplate)}
    />
  );
}
