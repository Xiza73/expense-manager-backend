import { daysInMonth } from '@/utils/date.util';

import { TransactionType } from '../domain/transaction-type.enum';
import { Transaction } from '../entities/transaction.entity';

export const getCurrentAmounts = (
  transactions: Transaction[],
  amount: number,
  type: TransactionType,
  isDeleted: boolean
) => {
  const thisExpenseAmount = type === TransactionType.EXPENSE ? Number(amount) : 0;
  const thisIncomeAmount = type === TransactionType.INCOME ? Number(amount) : 0;

  let expenseAmount = transactions.reduce(
    (sum, t) => sum + (t.type === TransactionType.EXPENSE ? Number(t.amount) : 0),
    0
  );
  let incomeAmount = transactions.reduce(
    (sum, t) => sum + (t.type === TransactionType.INCOME ? Number(t.amount) : 0),
    0
  );

  if (!isDeleted) {
    expenseAmount += thisExpenseAmount;
    incomeAmount += thisIncomeAmount;
  }

  expenseAmount = Math.round(expenseAmount * 100) / 100;
  incomeAmount = Math.round(incomeAmount * 100) / 100;

  return { expenseAmount, incomeAmount };
};

export const getDaysPassedInMonth = (transactions: Transaction[], date: Date) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const thisMonth = date.getMonth() + 1;
  const thisYear = date.getFullYear();
  const isCurrentMonth = currentMonth === thisMonth && currentYear === thisYear;
  const isFutureMonth = currentMonth < thisMonth || (currentMonth === thisMonth && currentYear < thisYear);

  let daysPassedInMonth = 0;

  if (isCurrentMonth) {
    daysPassedInMonth = today.getDate();
  } else if (isFutureMonth) {
    let lastDateFromTransactions = transactions.reduce(
      (lastDate, t) => (t.date > lastDate ? t.date : lastDate),
      new Date(1)
    );
    lastDateFromTransactions = lastDateFromTransactions > date ? lastDateFromTransactions : date;

    daysPassedInMonth = lastDateFromTransactions.getDate();
  } else {
    daysPassedInMonth = daysInMonth(thisMonth, thisYear);
  }

  return daysPassedInMonth;
};

export const getDaysLeftInMonth = (transactions: Transaction[], date: Date) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const thisMonth = date.getMonth() + 1;
  const thisYear = date.getFullYear();
  const isCurrentMonth = currentMonth === thisMonth && currentYear === thisYear;
  const isFutureMonth = currentMonth < thisMonth || (currentMonth === thisMonth && currentYear < thisYear);

  let daysLeftInMonth = 0;

  if (isCurrentMonth) {
    daysLeftInMonth = daysInMonth(thisMonth, thisYear) - today.getDate();
  } else if (isFutureMonth) {
    let lastDateFromTransactions = transactions.reduce(
      (lastDate, t) => (t.date > lastDate ? t.date : lastDate),
      new Date(1)
    );
    lastDateFromTransactions = lastDateFromTransactions > date ? lastDateFromTransactions : date;

    daysLeftInMonth = daysInMonth(thisMonth, thisYear) - lastDateFromTransactions.getDate();
  } else {
    daysLeftInMonth = daysInMonth(thisMonth, thisYear);
  }

  return daysLeftInMonth;
};
