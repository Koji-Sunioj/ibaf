import { TFilterState, MockFile } from "./types";

export const getParams = (filter: TFilterState) => {
  const stringParams = ["tags", "caption", "collection"];
  type Dict = {
    [key: string]: string;
  };

  const newParams: Dict = {};

  Object.keys(filter).forEach((key) => {
    const value = filter[key as keyof typeof filter];
    if (
      stringParams.includes(key) &&
      typeof value === "string" &&
      value.length > 0
    ) {
      newParams[key] = value;
    }
  });

  if (!filter.hideRange) {
    Object.assign(newParams, {
      startDate: filter.startDate,
      endDate: filter.endDate,
    });
  }

  return newParams;
};

export const getRefinedTags = (
  data: MockFile[],
  collection: string,
  tags: string
) => {
  const combined =
    data.length > 0
      ? data
          .map((item) => item.tags)
          .reduce(function (pre, cur) {
            return pre.concat(cur);
          })
      : [];

  const unique = Array.from(new Set(combined)).sort();
  return tags.length > 0
    ? unique.filter((item) => !tags.split(",").includes(item))
    : unique;
};
