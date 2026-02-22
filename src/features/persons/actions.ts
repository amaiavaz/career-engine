'use server';

import { db } from '@/src/lib/db';
import { revalidatePath } from 'next/cache';
import { personSchema, updatePersonSchema } from './types';
import { requireAdmin } from '@/src/lib/auth-guard';

export async function createPerson(data: unknown) {
  await requireAdmin();
  const parsed = personSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db.person.create({ data: parsed.data });
  revalidatePath('/persons');
  return { success: true };
}

export async function updatePerson(data: unknown) {
  await requireAdmin();
  const parsed = updatePersonSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { id, ...rest } = parsed.data;
  await db.person.update({ where: { id }, data: rest });
  revalidatePath('/persons');
  return { success: true };
}

export async function deletePerson(id: string) {
  await requireAdmin();
  try {
    await db.person.delete({ where: { id } });
    revalidatePath('/personas');
    return { success: true };
  } catch {
    return { success: false, error: 'Error al eliminar' };
  }
}
