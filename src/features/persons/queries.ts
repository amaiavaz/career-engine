import { requireAdmin } from '@/src/lib/auth-guard';
import { db } from '@/src/lib/db';

export async function getPersons({
  search,
  specialtyIds,
}: {
  search?: string;
  specialtyIds?: string[];
} = {}) {
  await requireAdmin();
  return db.person.findMany({
    where: {
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
      ...(specialtyIds?.length && {
        specialtyId: { in: specialtyIds },
      }),
    },
    include: {
      specialty: true,
      level: true,
      evaluator: true,
      evaluations: { orderBy: { date: 'desc' }, take: 1 },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getPersonById(id: string) {
  await requireAdmin();
  return db.person.findUnique({
    where: { id },
    include: {
      specialty: true,
      level: true,
      evaluator: true,
      evaluations: {
        orderBy: { date: 'desc' },
      },
    },
  });
}
