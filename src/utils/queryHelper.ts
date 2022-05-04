import { QueryDto } from 'src/shared/dtos/query.dto';
import { IOrderBy, orderByHelper } from './orderByHelper';
import { searchHelper } from './searchHelper';

interface IOptions {
  allowedSearch: string[];
  allowedFilter: string[];
  defaultSearch: object;
  defaultSearchOrExpressions?: object[];
  defaultOrderBy: IOrderBy;
}

interface IQueryParsed {
  find: object;
  sort: IOrderBy;
  skip: number;
}

export function queryHelper(
  query: QueryDto,
  {
    allowedSearch = [],
    defaultSearch = {},
    defaultOrderBy = {},
    defaultSearchOrExpressions,
    allowedFilter = [],
  }: IOptions,
): IQueryParsed {
  return {
    find: searchHelper({
      search: query.search,
      allowedSearch,
      defaultSearch,
      defaultSearchOrExpressions,
      filterParams: {
        allowedColumns: allowedFilter,
        params: query.filter,
      },
    }),
    sort:
      !!query?.order && query.order.length > 0
        ? orderByHelper(query.order)
        : defaultOrderBy,

    skip: (Math.max(1, query.page) - 1) * query.limit,
  };
}
