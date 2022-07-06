export interface IDashboardRepository {
  readDataClicks(id: string);
  readDataLinks(id: string);
  readDataGroups(id: string);
}
