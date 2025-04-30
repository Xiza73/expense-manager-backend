import { z } from 'zod';

import { Currency } from '@/api/account/domain/currency.enum';
import { Month } from '@/api/account/domain/month.enum';
import { PaymentMethod } from '@/api/transaction/domain/payment-method.enum';

export const commonValidations = {
  toValidNumber: z
    .any()
    .refine(
      (value) => {
        if (typeof value === 'number') return true;
        if (typeof value === 'string') return !isNaN(parseFloat(value));
        return false;
      },
      {
        message: 'Value must be a number or a string that can be parsed to a number',
      }
    )
    .transform((value) => {
      if (typeof value === 'string') return parseFloat(value);
      return value;
    }),

  optionalNumber: z
    .any()
    .refine(
      (value) => {
        if (!value) return true;
        if (typeof value === 'number') return true;
        if (typeof value === 'string') return !isNaN(parseFloat(value));
        return false;
      },
      {
        message: 'Value must be a number or a string that can be parsed to a number',
      }
    )
    .transform((value) => {
      if (typeof value === 'string') return parseFloat(value);

      return value;
    }),

  toValidDate: z
    .string()
    .refine(
      (value) => {
        if (isNaN(Date.parse(value))) return false;
        return true;
      },
      {
        message: 'Value must be a valid date',
      }
    )
    .transform((value) => {
      return new Date(value);
    }),

  toValidDateWithoutTimezone: z.date().transform((value) => {
    const dateWithoutTimezone = value.toISOString().split('.')[0];

    return dateWithoutTimezone;
  }),

  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Payment method is required' }),
  }),

  currency: z.nativeEnum(Currency, {
    errorMap: () => ({ message: 'Currency is required' }),
  }),

  month: z.nativeEnum(Month, {
    errorMap: () => ({ message: 'Month is required' }),
  }),

  year: z.number().min(1900, 'Year must be at least 1900'),
};
