export type TFilterState = {
  type: string;
  query: string;
  startDate: string;
  endDate: string;
  collection: string;
  hideRange: boolean;
  directRefer: boolean;
};

export type TAppState = {
  filter: TFilterState;
  photos: TPhotosState;
};

export type TSearchBarProps = {
  origin: string;
  search: (event: React.FormEvent<HTMLFormElement>) => void;
  removeTag: (buttonTag: string) => void;
};

export type TPhotosState = {
  data: null | MockFile[];
  loading: boolean;
  error: boolean;
  message: null | string;
};

export type MockFile = {
  caption: string;
  collection: string;
  date: string;
  file: string;
  photoId: string;
  tags: string[];
};

export type QueryParams = {
  query: string | null;
  startDate: string | null;
  endDate: string | null;
  collection: string | null;
  type: string | null;
};

export type SearchParams = {
  query: string;
  startDate: string;
  endDate: string;
  collection: string;
  type: string;
};

export type RefinedTags = {
  [key: string]: string[];
};
