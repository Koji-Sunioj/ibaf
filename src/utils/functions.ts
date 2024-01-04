import { TFilterState } from "./types";

export const getParams = (filter: TFilterState) => {
  const stringParams = ["tags", "caption", "collection"];
  type Cunt = {
    [key: string]: string;
  };

  const newParams: Cunt = {};

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
