import { z } from 'zod';
import type { Person, Specialty, Level, Evaluation } from '@prisma/client';

export type PersonWithRelations = Person & {
  specialty: Specialty;
  level: Level;
  evaluator: Person | null;
};

export type PersonWithEvaluations = PersonWithRelations & {
  evaluations: Evaluation[];
};

export const personSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.email('Email no válido'),
  specialtyId: z.string().min(1, 'Selecciona una especialidad'),
  levelId: z.string().min(1, 'Selecciona un nivel'),
  evaluatorId: z.string().optional(),
});

export const updatePersonSchema = personSchema.partial().extend({
  id: z.string().min(1),
});

export type PersonFormValues = z.infer<typeof personSchema>;
export type UpdatePersonFormValues = z.infer<typeof updatePersonSchema>;

export interface PersonRow {
  id: string;
  name: string;
  email: string;
  specialtyId: string;
  levelId: string;
  evaluatorId?: string | null;
  specialty: { id: string; name: string; color: string };
  level: { id: string; name: string; order: number };
  evaluator: { name: string } | null;
  evaluations: { score: number }[];
}
