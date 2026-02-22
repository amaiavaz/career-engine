'use client';

import { useQueryStates, parseAsArrayOf, parseAsString } from 'nuqs';
import { Input } from '@/src/components/ui/input';
import { Search } from 'lucide-react';
import type { Specialty } from '@prisma/client';
import { MultiSelect } from '../MultiSelect';

interface Props {
  specialties: Specialty[];
}

export default function PersonsFilters({ specialties }: Props) {
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(''),
      specialties: parseAsArrayOf(parseAsString, '|').withDefault([]),
    },
    { shallow: false },
  );

  return (
    <div className="flex gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <Input
          placeholder="Buscar por nombre..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="pl-9 bg-white"
        />
      </div>
      <div className="w-64">
        <MultiSelect
          options={specialties.map((s) => ({ value: s.id, label: s.name }))}
          selected={filters.specialties}
          onChange={(specialties) => setFilters({ specialties })}
          placeholder="Todas las especialidades"
        />
      </div>
    </div>
  );
}
