import { Link } from 'src/modules/links/models/link.model';
import { Group } from 'src/modules/links/models/groups.model';
import { LinkInfos } from '../../../links/models/link-infos.model';

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
  readClickEvent(click: LinkInfos);
  readManyLinksCreatedEvent(linksInformation: object);
  readGroupCreatedEvent(group: Group);
}
