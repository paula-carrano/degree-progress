export const normalizeText = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLocaleLowerCase("es");

export const normalizeCode = (value: unknown) => {
  const code = String(value ?? "").trim().toUpperCase();
  return /^\d+$/.test(code) ? String(Number(code)) : code;
};
