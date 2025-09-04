import {
  FindOptionsOrder,
  FindOptionsWhere,
  Like,
  ObjectLiteral,
  Repository,
  FindManyOptions,
  ILike, // Ajout pour supporter plus d'options
} from 'typeorm';

export interface PaginationParams {
  page: number;
  limit: number;
  search: string;
  orderBy: string;
  orderDirection: 'ASC' | 'DESC';
  type: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchField {
  field: string;
  isEnum?: boolean;
  // isBoolean?: boolean;
}

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  params: PaginationParams,
  searchFields: SearchField[],
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  extraOptions: Partial<FindManyOptions<T>> = {}, // Nouveau paramètre pour relations, etc.
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 10);
  const skip = (page - 1) * limit;

  const order = params.orderBy
    ? ({
        [params.orderBy]: params.orderDirection || 'ASC',
      } as FindOptionsOrder<T>)
    : ({} as FindOptionsOrder<T>);

  const searchConditions: FindOptionsWhere<T>[] = [];

  if (params.search) {
    searchFields.forEach((sf) => {
      if (sf.isEnum) return;

      if (sf.field === 'disponible') {
        // recherche dispo oui/non
        if (params.search.toLowerCase() === 'true') {
          searchConditions.push({ [sf.field]: true } as any);
        } else if (params.search.toLowerCase() === 'false') {
          searchConditions.push({ [sf.field]: false } as any);
        }
      } else {
        // recherche texte insensible à la casse
        searchConditions.push({
          [sf.field]: ILike(`%${params.search}%`),
        } as unknown as FindOptionsWhere<T>);
      }
    });
  }

  const typeCondition =
    params.type && searchFields.some((sf) => sf.field === 'type' && sf.isEnum)
      ? ({ type: params.type } as unknown as FindOptionsWhere<T>)
      : null;

  let finalWhere: FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined;

  if (searchConditions.length > 0 || typeCondition) {
    if (where || typeCondition) {
      const baseCondition = where
        ? Array.isArray(where)
          ? where[0]
          : where
        : ({} as FindOptionsWhere<T>);

      if (typeCondition) {
        Object.assign(baseCondition, typeCondition);
      }

      if (searchConditions.length > 0) {
        finalWhere = searchConditions.map((sc) => ({
          ...baseCondition,
          ...sc,
        }));
      } else {
        finalWhere = baseCondition;
      }
    } else {
      finalWhere =
        searchConditions.length > 1 ? searchConditions : searchConditions[0];
    }
  } else {
    finalWhere = where;
  }

  const [data, total] = await repository.findAndCount({
    where: finalWhere,
    skip,
    take: limit,
    order,
    ...extraOptions, // Applique les options supplémentaires comme relations
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}
