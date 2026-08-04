-- Cada fila indica que materia_id requiere haber aprobado requisito_id.
create table if not exists public.correlativas (
  materia_id integer not null references public.materias(id) on delete cascade,
  requisito_id integer not null references public.materias(id) on delete cascade,
  primary key (materia_id, requisito_id),
  constraint correlativa_no_puede_ser_ella_misma check (materia_id <> requisito_id)
);

create index if not exists correlativas_requisito_id_idx
  on public.correlativas(requisito_id);

-- Necesario para actualizar una materia existente al volver a importar el Excel.
create unique index if not exists materias_carrera_codigo_idx
  on public.materias(carrera_id, codigo);

-- La aplicación actual importa desde el navegador con la clave pública.
alter table public.correlativas enable row level security;

create policy "Correlativas visibles publicamente"
  on public.correlativas
  for select
  to anon, authenticated
  using (true);

create policy "Correlativas importables publicamente"
  on public.correlativas
  for insert
  to anon, authenticated
  with check (true);

create policy "Correlativas actualizables publicamente"
  on public.correlativas
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Correlativas eliminables publicamente"
  on public.correlativas
  for delete
  to anon, authenticated
  using (true);
