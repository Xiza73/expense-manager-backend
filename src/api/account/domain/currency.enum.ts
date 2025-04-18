export const Currency = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  JPY: 'JPY',
  AUD: 'AUD',
  CAD: 'CAD',
  CHF: 'CHF',
  CNY: 'CNY',
  SEK: 'SEK',
  NZD: 'NZD',
  PEN: 'PEN',
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];
