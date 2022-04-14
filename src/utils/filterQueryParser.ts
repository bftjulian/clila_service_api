import {} from 'mongoose';

export interface IFilterDateValue {
  start_date: Date;

  end_date: Date;
}

export interface IFilterParams {
  type: 'string' | 'date';

  column: string;

  value: IFilterDateValue | string;
}

export function filterQueryParser(
  filterParams: IFilterParams[],
  allowedColumns: string[] = [],
) {
  return filterParams.reduce((previous, current) => {
    switch (current.type) {
      case 'string':
        if (typeof current.value !== 'string') break;
        if (allowedColumns.includes(current.column)) {
          previous[current.column] = new RegExp(current.value, 'i');
        }
        break;
      case 'date':
        if (typeof current.value !== 'object') break;
        if (allowedColumns.includes(current.column)) {
          previous[current.column] = {
            $gte: current.value.start_date,
            $lte: current.value.end_date,
          };
        }
        break;
      default:
        if (!previous) return {};

        break;
    }
    if (!previous) return {};
    return previous;
  }, {});
}
