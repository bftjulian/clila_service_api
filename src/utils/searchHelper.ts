interface ISearch {
  search: string;
  allowedSearch: string[];
  defaultSearch: object;
}

export function searchHelper({
  search,
  allowedSearch,
  defaultSearch,
}: ISearch) {
  let findArray = [defaultSearch];
  if (search) {
    findArray = [];
    allowedSearch.forEach((field) => {
      findArray.push({
        ...defaultSearch,
        [field]: new RegExp(search, 'i'),
      });
    });
  }

  console.log(findArray);

  const findObject = {
    $or: findArray,
  };

  return findObject;
}
