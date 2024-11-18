export const currencyFormat = (num: number) =>
  `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

export function isValidYear(year: string): boolean {
  // Regular expression to match years from 1900 to 2199
  const yearRegex = /^(19[0-9]{2}|20[0-9]{2}|21[0-9]{2})$/;

  return yearRegex.test(year);
}
