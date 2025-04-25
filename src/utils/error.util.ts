export const handleErrorMessage = (prefix: string, error: any): string => {
  try {
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
    if (error instanceof Error) return `${prefix}: ${error.message}`;

    return prefix;
  } catch (error) {
    return `${prefix}: ${error}`;
  }
};
