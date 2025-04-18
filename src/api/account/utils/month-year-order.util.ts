import { Month } from '../domain/month.enum';

const MonthsOrder = {
  [Month.JANUARY]: 1,
  [Month.FEBRUARY]: 2,
  [Month.MARCH]: 3,
  [Month.APRIL]: 4,
  [Month.MAY]: 5,
  [Month.JUNE]: 6,
  [Month.JULY]: 7,
  [Month.AUGUST]: 8,
  [Month.SEPTEMBER]: 9,
  [Month.OCTOBER]: 10,
  [Month.NOVEMBER]: 11,
  [Month.DECEMBER]: 12,
};

export const monthYearOrder = (month1: Month, year1: number, month2: Month, year2: number) => {
  const sameYear = year1 === year2;

  if (sameYear) {
    return MonthsOrder[month1] - MonthsOrder[month2];
  }

  return year1 - year2;
};
