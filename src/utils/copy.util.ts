import _ from 'lodash';

export const copy = <T>(object: T): Partial<T> => {
  return _.cloneDeep(object);
};
