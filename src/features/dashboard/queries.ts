import { db } from '@/src/lib/db';

export async function getDashboardStats() {
  const [
    totalPersons,
    totalSpecialties,
    completedEvaluations,
    personsByLevel,
    personsBySpecialty,
  ] = await Promise.all([
    db.person.count(),
    db.specialty.count(),
    db.evaluation.findMany({
      where: { status: 'COMPLETED' },
      select: { score: true },
    }),
    db.person.groupBy({
      by: ['levelId'],
      _count: { id: true },
    }),
    db.person.groupBy({
      by: ['specialtyId'],
      _count: { id: true },
    }),
  ]);

  const averageCompliance = completedEvaluations.length
    ? Math.round(
        completedEvaluations.reduce((acc, e) => acc + e.score, 0) /
          completedEvaluations.length,
      )
    : 0;

  return {
    totalPersons,
    totalSpecialties,
    activeCompetencies: 70,
    averageCompliance,
    personsByLevel,
    personsBySpecialty,
  };
}

export async function getRecentEvaluations() {
  return db.evaluation.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: {
      person: {
        include: {
          specialty: true,
          level: true,
        },
      },
    },
  });
}
