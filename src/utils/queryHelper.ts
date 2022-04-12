import { QueryDto } from 'src/modules/links/shared/dtos/query.dto';
import { searchHelper } from './searchHelper';

interface IOptions {
  allowedSearch: string[];
  defaultSearch: object;
}

interface IQueryParsed {
  find: object;
}

export function queryHelper(
  query: QueryDto,
  { allowedSearch = [], defaultSearch = {} }: IOptions,
): IQueryParsed {
  return {
    find: searchHelper({ search: query.search, allowedSearch, defaultSearch }),
  };
}
