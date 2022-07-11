export interface ICacheDataRepository {
  create(id: string, data: any): Promise<any>;
  read(id: string): Promise<any>;
  delete(id: string): Promise<any>;
  readManyByPattern(idPattern: string): Promise<any>;
}
