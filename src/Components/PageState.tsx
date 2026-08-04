export const PageLoading = () => (
  <div className="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">
    Cargando información académica...
  </div>
);

export const PageError = ({ message }: { message: string }) => (
  <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
    No se pudo cargar la información: {message}
  </div>
);
