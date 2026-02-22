'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import { useCallback, useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command';

export type Option = {
  value: string;
  label: string;
};
type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Seleccionar...',
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (value: string) => {
      const newSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      onChange(newSelected);
    },
    [selected, onChange],
  );

  const selectedLabels = useMemo(
    () =>
      options
        .filter((opt) => selected.includes(opt.value))
        .map((opt) => opt.label),
    [options, selected],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between bg-white w-full', className)}
        >
          <span className="truncate text-sm">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : selected.length === 1 ? (
              selectedLabels[0]
            ) : (
              `${selected.length} seleccionados`
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected.includes(option.value)
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
