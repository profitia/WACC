export const pln = (value: number): string =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value);

export const pct = (value: number): string =>
  new Intl.NumberFormat('pl-PL', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const num = (value: number): string =>
  new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 2 }).format(value);
