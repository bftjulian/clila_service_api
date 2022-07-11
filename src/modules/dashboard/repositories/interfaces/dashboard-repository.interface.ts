export interface IDashboardRepository {
  readTotalClicks(id: string);
  readTotalLinks(id: string);
  readTotalGroups(id: string);
  readTotalClicksPerPeriod(id: string);
  readTotalLinksPerPeriod(id: string);
  readTotalGroupsPerPeriod(id: string);
  readDataClicks(id: string);
  readDataLinks(id: string);
  readDataGroups(id: string);
}
