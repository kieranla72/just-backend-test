const getRepository = () => ({ createQueryBuilder, ...queryBuilderObject });
const createQueryBuilder = () => queryBuilderObject;
const getMany = () => queryBuilderObject;

export const queryBuilderObject = {
  getRepository: () => queryBuilderObject,
  createQueryBuilder: () => queryBuilderObject,
  where: () => queryBuilderObject,
  orderBy: () => queryBuilderObject,
  insert: () => queryBuilderObject,
  values: () => queryBuilderObject,
  andWhere: () => queryBuilderObject,

  getMany: (): any[] => [],
  execute: (): any[] => [],
};

export const typeORMMock: any = {
  createQueryBuilder,
  getRepository,
  getMany,
  queryBuilderObject,
};
