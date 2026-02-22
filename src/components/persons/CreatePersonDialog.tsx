'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  personSchema,
  type PersonFormValues,
} from '@/src/features/persons/types';
import { createPerson, updatePerson } from '@/src/features/persons/actions';
import type { Specialty, Level } from '@prisma/client';
import { toast } from 'sonner';

interface Props {
  trigger: React.ReactNode;
  person?: {
    id: string;
    name: string;
    email: string;
    specialtyId: string;
    levelId: string;
    evaluatorId?: string;
  };
  specialties: Specialty[];
  levels: Level[];
  persons: Array<{ id: string; name: string }>;
}

export default function CreatePersonDialog({
  trigger,
  person,
  specialties,
  levels,
  persons,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue, reset } = useForm<PersonFormValues>(
    {
      resolver: zodResolver(personSchema),
      defaultValues: person
        ? {
            name: person.name,
            email: person.email,
            specialtyId: person.specialtyId,
            levelId: person.levelId,
            evaluatorId: person.evaluatorId ?? undefined,
          }
        : {},
    },
  );

  async function onSubmit(data: PersonFormValues) {
    setLoading(true);
    const result = person
      ? await updatePerson({ ...data, id: person.id })
      : await createPerson(data);

    if (result.error) {
      toast.error('Error al guardar la persona');
      setLoading(false);
      return;
    }

    toast.success(
      person ? 'Persona actualizada' : 'Persona creada correctamente',
    );
    reset();
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {person ? 'Editar persona' : 'Nueva persona'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input {...register('name')} placeholder="Nombre completo" />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              {...register('email')}
              type="email"
              placeholder="correo@empresa.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Especialidad</Label>
            <Select
              onValueChange={(v) => setValue('specialtyId', v)}
              defaultValue={person?.specialtyId}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Selecciona especialidad" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nivel</Label>
            <Select
              onValueChange={(v) => setValue('levelId', v)}
              defaultValue={person?.levelId}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Selecciona nivel" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Evaluador{' '}
              <span className="text-zinc-400 text-xs">(opcional)</span>
            </Label>
            <Select
              onValueChange={(v) => setValue('evaluatorId', v)}
              defaultValue={person?.evaluatorId ?? undefined}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Sin evaluador" />
              </SelectTrigger>
              <SelectContent>
                {persons
                  .filter((p) => p.id !== person?.id)
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
