export const ErrorCode = {
  // Common
  UNKNOWN_400: 'UNKN400',
  UNKNOWN_500: 'UNKN500',
  // Auth
  UNAUTHORIZED_BY_MIDDLEWARE_401: 'UTBM_401',
  UNAUTHORIZED_BY_MIDDLEWARE_TOKEN_401: 'UTBT_401',
  USER_ALREADY_EXISTS_400: 'USAE_400',
  USER_NOT_FOUND_404: 'USNF_404',
  // Account
  ACCOUNT_ALREADY_EXISTS_400: 'AAEX_400',
  ACCOUNT_NOT_FOUND_404: 'ACNF_404',
  ACCOUNT_CANNOT_DELETE_DEFAULT_400: 'ACCD_400',
  ACCOUNT_CANNOT_CHANGE_CURRENCY_400: 'ACCC_400',
  // Transaction
  TRANSACTION_NOT_FOUND_404: 'TNF_404',
  TRANSACTION_CANNOT_DELETE_ACTIVE_400: 'TCAD_400',
  TRAN_CATEGORY_NOT_FOUND_404: 'TCNF_404',
  TRAN_SERVICE_NOT_FOUND_404: 'TSNF_404',
  // Transaction Category
  TRANSACTION_CATEGORY_ALREADY_EXISTS_400: 'TCAE_400',
  TRANSACTION_CATEGORY_NOT_FOUND_404: 'TCAE_400',
  // Transaction Service
  TRANSACTION_SERVICE_ALREADY_EXISTS_400: 'TSAE_400',
  TRANSACTION_SERVICE_NOT_FOUND_404: 'TSNF_404',
  TRANSACTION_DATE_OUT_OF_DATE_400: 'TDOD_400',
  // Settings
  SETTINGS_NOT_FOUND_404: 'SSNF_404',
  SETTINGS_ALREADY_EXISTS_400: 'SSAE_400',
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const SuccessCode = {
  // Common
  SUCCESS_200: 'SCSS200',
  SUCCESS_201: 'SCSS201',
  SUCCESS_202: 'SCSS202',
} as const;
export type SuccessCode = (typeof SuccessCode)[keyof typeof SuccessCode];

export const ResponseCode = {
  ...ErrorCode,
  ...SuccessCode,
} as const;
export type ResponseCode = (typeof ResponseCode)[keyof typeof ResponseCode];
