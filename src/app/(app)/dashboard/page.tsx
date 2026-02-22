import {
  getDashboardStats,
  getRecentEvaluations,
} from '@/src/features/dashboard/queries';
import { db } from '@/src/lib/db';
import { Users, Briefcase, Target, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import LevelChart from '@/src/components/recharts/LevelChart';
import SpecialtyChart from '@/src/components/recharts/SpecialtyChart';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';

export default async function DashboardPage() {
  const [stats, recentEvaluations, levels, specialties] = await Promise.all([
    getDashboardStats(),
    getRecentEvaluations(),
    db.level.findMany({ orderBy: { order: 'asc' } }),
    db.specialty.findMany(),
  ]);

  const levelChartData = stats.personsByLevel.map((item) => ({
    name: levels.find((l) => l.id === item.levelId)?.name ?? 'Desconocido',
    total: item._count.id,
  }));

  const specialtyChartData = stats.personsBySpecialty.map((item) => ({
    name:
      specialties.find((s) => s.id === item.specialtyId)?.name ?? 'Desconocido',
    value: item._count.id,
    color: specialties.find((s) => s.id === item.specialtyId)?.color ?? '#888',
  }));

  const kpis = [
    {
      label: 'Total personas',
      value: stats.totalPersons,
      icon: Users,
      hint: '+12 este mes',
    },
    {
      label: 'Especialidades',
      value: stats.totalSpecialties,
      icon: Briefcase,
      hint: 'Todas activas',
    },
    {
      label: 'Competencias activas',
      value: stats.activeCompetencies,
      icon: Target,
      hint: 'En 5 especialidades',
    },
    {
      label: 'Cumplimiento medio',
      value: `${stats.averageCompliance}%`,
      icon: TrendingUp,
      hint: '+4% vs anterior',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-zinc-500 text-sm">
          Resumen del framework de carrera profesional
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, hint }) => (
          <Card key={label}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500">{label}</p>
                  <p className="text-3xl font-bold mt-1">{value}</p>
                  <p className="text-xs text-zinc-400 mt-1">{hint}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Icon size={20} className="text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Distribución por nivel</CardTitle>
          </CardHeader>
          <CardContent>
            <LevelChart data={levelChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Personas por especialidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpecialtyChart data={specialtyChartData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evaluaciones recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentEvaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="grid grid-cols-6 gap-3 items-center"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  {evaluation.person.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{evaluation.person.name}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {evaluation.person.specialty.name}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {evaluation.person.level.name}
              </Badge>

              <div className="w-32 bg-zinc-100 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${evaluation.score}%` }}
                />
              </div>
              <Badge
                className={
                  evaluation.score >= 70
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }
              >
                {evaluation.score >= 70 ? 'Alcanzado' : 'En progreso'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
