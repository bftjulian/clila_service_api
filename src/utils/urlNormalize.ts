export const urlNormalize = (url: string) => {
  if (url.indexOf('http') < 0) {
    return `https://${url}`;
  }

  return url;
};
