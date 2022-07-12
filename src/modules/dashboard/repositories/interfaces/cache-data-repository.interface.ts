export interface ICacheDataRepository {
  create(id: string, data: any);
  read(id: string);
  delete(id: string);
  readManyByPattern(idPattern: string);
}
