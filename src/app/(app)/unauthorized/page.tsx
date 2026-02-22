export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Acceso denegado</h1>
        <p className="text-zinc-500 mt-2">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    </div>
  );
}
