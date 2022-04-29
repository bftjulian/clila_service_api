import { QueryDto } from 'src/modules/links/shared/dtos/query.dto';
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
  console.log(query);
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
  };
}
