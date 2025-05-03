import { TransactionCategory } from '../../entities/transaction-category.entity';

export const transactionCategorySeed: Partial<TransactionCategory>[] = [
  {
    name: 'Food and Drinks',
    icon: 'food',
    color: '#FF0000',
  },
  {
    name: 'Shopping',
    icon: 'shopping',
    color: '#00FF00',
  },
  {
    name: 'Housing',
    icon: 'housing',
    color: '#0000FF',
  },
  {
    name: 'Transportation',
    icon: 'transportation',
    color: '#FFFF00',
  },
  {
    name: 'Vehicle',
    icon: 'vehicle',
    color: '#00FFFF',
  },
  {
    name: 'Life and Entertainment',
    icon: 'life',
    color: '#FF00FF',
  },
  {
    name: 'Communication',
    icon: 'communication',
    color: '#00FF00',
  },
  {
    name: 'Financial expenses',
    icon: 'financial',
    color: '#0000FF',
  },
  {
    name: 'Investments',
    icon: 'investments',
    color: '#FFFF00',
  },
  {
    name: 'Household expenses',
    icon: 'household',
    color: '#FF0000',
  },
  {
    name: 'Other',
    icon: 'other',
    color: '#00FFFF',
  },
];
