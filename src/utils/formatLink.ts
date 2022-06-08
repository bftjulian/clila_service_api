export function formatLink(link: string) {
  if (link.indexOf('http//') >= 0) {
    link = link.replace('http//', '');
  }
  if (link.indexOf('https//') >= 0) {
    link = link.replace('https//', '');
  }
  if (link.indexOf('https') === -1) {
    const regex = new RegExp('^(http|https)://', 'i');
    link = link.replace(regex, '');
    if (link.indexOf('http') >= 0) {
      link = 'https://' + link;
    } else {
      link = 'https://' + link;
    }
  }
  return link;
}
