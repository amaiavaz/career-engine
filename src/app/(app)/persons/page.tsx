import { getPersons } from '@/src/features/persons/queries';
import { db } from '@/src/lib/db';
import { Button } from '@/src/components/ui/button';
import { Plus } from 'lucide-react';
import CreatePersonDialog from '@/src/components/persons/CreatePersonDialog';
import PersonsFilters from '@/src/components/persons/PersonsFilters';
import PersonsTable from '@/src/components/persons/PersonsTable';

type Props = {
  searchParams: Promise<{
    search?: string;
    specialties?: string;
  }>;
};

export default async function PersonsPage({ searchParams }: Props) {
  const params = await searchParams;

  const specialtyIds = params.specialties
    ? params.specialties.split('|').filter(Boolean)
    : [];

  const [persons, specialties, levels] = await Promise.all([
    getPersons({ search: params.search, specialtyIds }),
    db.specialty.findMany(),
    db.level.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const personsForEvaluator = persons.map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personas</h1>
          <p className="text-zinc-500 text-sm">
            Gestión de empleados y su progreso profesional
          </p>
        </div>
        <CreatePersonDialog
          specialties={specialties}
          levels={levels}
          persons={personsForEvaluator}
          trigger={
            <Button>
              <Plus size={16} className="mr-2" /> Nueva persona
            </Button>
          }
        />
      </div>

      <PersonsFilters specialties={specialties} />
      <PersonsTable
        persons={persons}
        specialties={specialties}
        levels={levels}
      />
    </div>
  );
}
