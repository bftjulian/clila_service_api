import * as nestedProperty from 'nested-property';
import { filterQueryParser } from './filterQueryParser';

export interface IFilterDateValue {
  start_date: Date;

  end_date: Date;
}

export type SearchField =
  | string
  | {
      fieldName: string;
      fieldType: 'string' | 'number';
    };

export interface IFilterParams {
  type: 'string' | 'date';

  column: string;

  value: IFilterDateValue | string;
}

interface ISearch {
  search: string;
  allowedSearch: string[];
  defaultSearch: object;
  filterParams?: {
    params: IFilterParams[];
    allowedColumns: string[];
  };
}

interface ISearchData {
  [key: string]: any;
}

function getSearchData(
  searchString: string,
  field: SearchField,
): ISearchData | undefined {
  const haveNeated =
    typeof field === 'string'
      ? field.indexOf('.') >= 0
      : field.fieldName.indexOf('.') >= 0;

  let returnValue: ISearchData;

  if (typeof field === 'string') {
    returnValue = { [field]: new RegExp(searchString, 'i') };
    if (!haveNeated) return returnValue;
    const response = {};

    nestedProperty.set(response, field, new RegExp(searchString, 'i'));
    return response;
  }

  if (field.fieldType === 'number') {
    try {
      const number = Number(searchString);
      const response = {};

      if (Number.isNaN(number)) return undefined;
      return { [field.fieldName]: new RegExp(`${number}`, 'i') };
      return response;
    } catch {
      return undefined;
    }
  }

  // if (field.fieldType === 'date') {
  //   try {
  //     const date = new Date(searchString);
  //     if (isNaN(date.getTime()) || !isNaN(Number(searchString)))
  //       return undefined;

  //     return { [field.fieldName]: Between(startOfDay(date), endOfDay(date)) };
  //   } catch {
  //     return undefined;
  //   }
  // }

  return undefined;
}

export function searchHelper({
  search,
  allowedSearch,
  defaultSearch,
  filterParams,
}: ISearch) {
  let findArray = [defaultSearch];

  const searchParams = {
    ...defaultSearch,
    ...filterQueryParser(filterParams.params, filterParams.allowedColumns),
  };

  console.log(searchParams);

  if (!search) return searchParams;

  findArray = [];
  allowedSearch.forEach((field) => {
    findArray.push({
      ...searchParams,
      ...getSearchData(search, field),
    });
  });

  const findObject = {
    $or: findArray,
  };

  return findObject;
}
