import 'colors';

export const LogType = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  DEBUG: 'DEBUG',
  START_TIME: 'START_TIME',
  END_TIME: 'END_TIME',
} as const;
export type LogType = (typeof LogType)[keyof typeof LogType];

export const LogTypeColors = {
  INFO: 'green',
  ERROR: 'red',
  WARNING: 'yellow',
  DEBUG: 'blue',
  START_TIME: 'magenta',
  END_TIME: 'magenta',
} as const;

const setLogTypeColor = (type: LogType) => {
  switch (type) {
    case LogType.INFO:
      return type.green;
    case LogType.ERROR:
      return type.red;
    case LogType.WARNING:
      return type.yellow;
    case LogType.DEBUG:
      return type.blue;
    case LogType.START_TIME:
      return type.magenta;
    case LogType.END_TIME:
      return type.magenta;
    default:
      return type;
  }
};

const loggger = (type: LogType, message: string, data?: any) => {
  const hour = new Date().toISOString();
  const logType = setLogTypeColor(type);
  const logMessage = message.cyan;
  const logData = data ? JSON.stringify(data, null, 2).cyan : '';

  // eslint-disable-next-line no-console
  console.log(`[${hour}] ${logType} ${logMessage} ${logData}`);
};

const LogHandler: Record<LogType, (message: string, data?: any) => void> = {
  [LogType.INFO]: (message: string, data?: any) => loggger(LogType.INFO, message, data),
  [LogType.ERROR]: (message: string, data?: any) => loggger(LogType.ERROR, message, data),
  [LogType.WARNING]: (message: string, data?: any) => loggger(LogType.WARNING, message, data),
  [LogType.DEBUG]: (message: string, data?: any) => loggger(LogType.DEBUG, message, data),
  [LogType.START_TIME]: (message: string, data?: any) => loggger(LogType.START_TIME, message, data),
  [LogType.END_TIME]: (message: string, data?: any) => loggger(LogType.END_TIME, message, data),
};

export const log = {
  info: LogHandler[LogType.INFO],
  error: LogHandler[LogType.ERROR],
  warning: LogHandler[LogType.WARNING],
  debug: LogHandler[LogType.DEBUG],
  startTime: LogHandler[LogType.START_TIME],
  endTime: LogHandler[LogType.END_TIME],
};
