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
};
