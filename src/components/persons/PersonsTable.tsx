'use client';

import { Badge } from '@/src/components/ui/badge';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import CreatePersonDialog from './CreatePersonDialog';
import DeletePersonButton from './DeletePersonButton';
import type { Specialty, Level } from '@prisma/client';
import { PersonRow } from '@/src/features/persons/types';

interface Props {
  persons: PersonRow[];
  specialties: Specialty[];
  levels: Level[];
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < current ? 'bg-blue-600' : 'bg-zinc-200'}`}
        />
      ))}
      <span className="text-xs text-zinc-400 ml-1">
        {current}/{total}
      </span>
    </div>
  );
}

function ComplianceBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'text-blue-600'
      : score >= 60
        ? 'text-orange-500'
        : 'text-red-500';
  const barColor =
    score >= 80 ? 'bg-blue-600' : score >= 60 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 bg-zinc-100 rounded-full h-1.5">
        <div
          className={`${barColor} h-1.5 rounded-full`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-medium ${color}`}>{score}%</span>
    </div>
  );
}

export default function PersonsTable({ persons, specialties, levels }: Props) {
  const totalLevels = levels.length;
  const personsForEvaluator = persons.map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-4xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Persona</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Nivel actual</TableHead>
            <TableHead>Progreso en jerarquía</TableHead>
            <TableHead>Cumplimiento</TableHead>
            <TableHead>Evaluador</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {persons.map((person) => {
            const currentLevelOrder =
              levels.find((l) => l.id === person.levelId)?.order ?? 1;

            return (
              <TableRow key={person.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                        {person.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-zinc-400">
                        {person.level.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: person.specialty.color,
                      color: person.specialty.color,
                    }}
                  >
                    {person.specialty.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{person.level.name}</Badge>
                </TableCell>
                <TableCell>
                  <ProgressDots
                    current={currentLevelOrder}
                    total={totalLevels}
                  />
                </TableCell>
                <TableCell>
                  <ComplianceBar score={person.evaluations[0]?.score ?? 0} />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-zinc-600">
                    {person.evaluator?.name ?? '—'}
                  </span>
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <CreatePersonDialog
                    key={person.id + person.name + person.levelId}
                    specialties={specialties}
                    levels={levels}
                    persons={personsForEvaluator}
                    person={{
                      id: person.id,
                      name: person.name,
                      email: person.email,
                      specialtyId: person.specialtyId,
                      levelId: person.levelId,
                      evaluatorId: person.evaluatorId ?? undefined,
                    }}
                    trigger={
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    }
                  />
                  <DeletePersonButton
                    personId={person.id}
                    personName={person.name}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
