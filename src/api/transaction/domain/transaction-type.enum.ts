export const ExtraTransactionType = {
  DEBT: 'DEBT',
  LOAN: 'LOAN',
} as const;
export type ExtraTransactionType = (typeof ExtraTransactionType)[keyof typeof ExtraTransactionType];

export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  ...ExtraTransactionType,
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
