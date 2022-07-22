export const ClicksPipeline: object[] = [
  {
    $group: {
      _id: {
        link: '$link',
        date: {
          $dateToString: { format: '%Y-%m-%dT%H:%M', date: '$create_at' },
        },
      },
      clicks: { $count: {} },
    },
  },
  {
    $lookup: {
      from: 'links',
      localField: '_id.link',
      foreignField: '_id',
      as: 'link',
    },
  },
  {
    $project: {
      _id: 0,
      clicks: 1,
      date: '$_id.date',
      link: { $first: '$link' },
    },
  },
  {
    $lookup: {
      from: 'groups',
      localField: 'link.group',
      foreignField: '_id',
      as: 'group',
    },
  },
  {
    $project: {
      clicks: 1,
      date: 1,
      link: 1,
      group: { $first: '$group' },
    },
  },
  {
    $project: {
      date: 1,
      clicks: 1,
      name: '$link.name',
      group_name: '$group.name',
      group_tags: '$group.tag',
      user_id: '$link.user',
      link_id: '$link._id',
      group_id: '$group._id',
      // short_link: '$link.short_link',
      // original_link: '$link.original_link',
      // total_clicks: '$link.numbers_clicks',
    },
  },
  {
    $sort: {
      date: -1,
    },
  },
];

export const LinksPipeline: object[] = [
  {
    $group: {
      _id: {
        date: {
          $dateToString: { format: '%Y-%m-%dT%H:%M', date: '$create_at' },
        },
        group: '$group',
      },
      count_links: { $count: {} },
      total_clicks: { $sum: '$numbers_clicks' },
    },
  },
  {
    $lookup: {
      from: 'groups',
      localField: '_id.group',
      foreignField: '_id',
      as: 'group',
    },
  },
  {
    $project: {
      _id: 0,
      date: '$_id.date',
      group: { $first: '$group' },
      count_links: 1,
      total_clicks: 1,
    },
  },
  {
    $project: {
      date: 1,
      group_id: '$group._id',
      group_name: '$group.name',
      group_tags: '$group.tags',
      count_links: 1,
      total_clicks: 1,
    },
  },
  {
    $sort: {
      date: -1,
    },
  },
];

export const GroupsPipeline: object[] = [
  {
    $group: {
      _id: {
        date: {
          $dateToString: { format: '%Y-%m-%dT%H:%M', date: '$createdAt' },
        },
        user_id: '$user',
      },
      total_groups: { $count: {} },
      total_clicks: { $sum: '$total_clicks' },
    },
  },
  {
    $project: {
      _id: 0,
      date: '$_id.date',
      total_groups: 1,
      user_id: '$_id.user_id',
    },
  },
];
