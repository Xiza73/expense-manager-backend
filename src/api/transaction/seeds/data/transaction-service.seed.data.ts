import { TransactionService } from '../../entities/transaction-service.entity';

export const transactionServiceSeed: Partial<TransactionService>[] = [
  {
    name: 'Netflix',
    icon: 'netflix',
    color: '#FF0000',
  },
  {
    name: 'Amazon Prime',
    icon: 'amazon prime',
    color: '#0000FF',
  },
  {
    name: 'Rappi',
    icon: 'rappi',
    color: '#00FF00',
  },
  {
    name: 'PedidosYa',
    icon: 'pedidosya',
    color: '#FFFF00',
  },
  {
    name: 'Uber',
    icon: 'uber',
    color: '#00FFFF',
  },
  {
    name: 'InDrive',
    icon: 'indrive',
    color: '#FF00FF',
  },
  {
    name: 'Other',
    icon: 'other',
    color: '#0000FF',
  },
];
