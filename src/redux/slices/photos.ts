import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { TPhotosState, TFilterState, MockFile } from "../../utils/types";

export const fetchPhotos = createAsyncThunk(
  "fetch-photos",
  async (filter: TFilterState) => {
    const request = await fetch("188.json");
    const response = await request.json();
    if (!request.ok) {
      const { message } = response;
      throw new Error(message);
    }
    let filtered;
    const { collection, query, startDate, endDate, hideRange, type } = filter;

    if (type === "caption") {
      filtered =
        query.length > 0
          ? response.filter((photo: MockFile) =>
              photo.caption.toLowerCase().includes(query!.toLowerCase())
            )
          : response;
    } else if (type === "tags") {
      const tagsArr = query.split(",");
      filtered =
        query.length > 0
          ? response.filter((photo: MockFile) =>
              tagsArr?.every((tag: string) => photo.tags.includes(tag))
            )
          : response;
    }

    if (!collection.includes("All collections"))
      filtered = filtered.filter(
        (photo: MockFile) => photo.collection === collection
      );

    if (!hideRange) {
      filtered = filtered.filter(
        (photo: MockFile) => photo.date > startDate && photo.date < endDate
      );
    }

    return filtered;
  }
);

export const initialPhotosState: TPhotosState = {
  data: null,
  loading: false,
  error: false,
  message: null,
};

export const photosSlice = createSlice({
  name: "photos",
  initialState: initialPhotosState,
  reducers: {
    resetPhotos: () => initialPhotosState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        const photos = action.payload;
        state.loading = false;
        state.data = photos;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.message = action.error.message!;
        state.loading = false;
        state.error = true;
      });
  },
});

export const { resetPhotos } = photosSlice.actions;
export default photosSlice.reducer;
