import { QueryDto } from 'src/modules/links/shared/dtos/query.dto';
import { IOrderBy, orderByHelper } from './orderByHelper';
import { searchHelper } from './searchHelper';

interface IOptions {
  allowedSearch: string[];
  defaultSearch: object;
  defaultOrderBy: IOrderBy;
}

interface IQueryParsed {
  find: object;
  sort: IOrderBy;
}

export function queryHelper(
  query: QueryDto,
  { allowedSearch = [], defaultSearch = {}, defaultOrderBy = {} }: IOptions,
): IQueryParsed {
  return {
    find: searchHelper({ search: query.search, allowedSearch, defaultSearch }),
    sort:
      !!query?.order && query.order.length > 0
        ? orderByHelper(query.order)
        : defaultOrderBy,
  };
}
