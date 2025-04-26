export const handleErrorMessage = (prefix: string, error: any): string => {
  try {
    if (error instanceof Error) {
      if (error.message.includes('numeric field overflow')) {
        return `${prefix}: Amount is too high`;
      }

      return `${prefix}: ${error.message}`;
    }

    if (Array.isArray(JSON.parse(error))) {
      const errArray: any[] = JSON.parse(error);

      const errMessage = errArray
        .reduce((acc: string[], curr: any) => {
          const message = curr.message;

          return [...acc, `${curr.path.join('.')}: ${message}`];
        }, [])
        .join(' | ');

      return `${prefix}: ${errMessage}`;
    }

    return prefix;
  } catch (error) {
    return `${prefix}: ${error}`;
  }
};
