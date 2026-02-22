'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog';
import { deletePerson } from '@/src/features/persons/actions';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface Props {
  personId: string;
  personName: string;
}

export default function DeletePersonButton({ personId, personName }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const result = await deletePerson(personId);

    if (result.error) {
      toast.error('Error al eliminar la persona');
      setLoading(false);
      return;
    }

    toast.success(`${personName} eliminado correctamente`);
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar a {personName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
