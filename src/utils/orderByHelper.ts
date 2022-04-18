import * as nestedProperty from 'nested-property';

interface IOrder {
  name: string;

  order: 'ASC' | 'DESC';
}

export interface IOrderBy {
  [key: string]: 'asc' | 'desc';
}

export function orderByHelper(order: IOrder[]): IOrderBy {
  return order.reduce((previous, current) => {
    nestedProperty.set(previous, current.name, current.order.toLowerCase());
    return previous;
  }, {});
}
