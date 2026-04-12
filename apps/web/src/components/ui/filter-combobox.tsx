'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  type ComboboxOption,
} from '@/components/ui/combobox';

interface FilterComboboxProps {
  options: readonly ComboboxOption[];
  value: string;
  placeholder: string;
  emptyText: string;
  clearLabel?: string;
  disabled?: boolean;
  inputClassName?: string;
  contentClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  onValueChange: (value: string) => void;
}

export function FilterCombobox({
  options,
  value,
  placeholder,
  emptyText,
  clearLabel,
  disabled = false,
  inputClassName,
  contentClassName,
  listClassName,
  itemClassName,
  onValueChange,
}: FilterComboboxProps) {
  return (
    <Combobox items={options} value={value} disabled={disabled} onValueChange={(nextValue) => onValueChange(nextValue)}>
      <ComboboxInput placeholder={placeholder} clearLabel={clearLabel} disabled={disabled} className={inputClassName} />
      <ComboboxContent className={contentClassName}>
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList className={listClassName}>
          {(rawItem) => {
            const item = rawItem as ComboboxOption;
            return (
              <ComboboxItem key={item.value} value={item.value} className={itemClassName}>
                {item.label}
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
