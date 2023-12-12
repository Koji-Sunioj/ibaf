import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { TPhotosState, TFilterState, MockFile } from "../../utils/types";

export const fetchPhotos = createAsyncThunk(
  "fetch-photos",
  async (filter: TFilterState) => {
    console.log("fetching");
    const request = await fetch("188.json");
    const response = await request.json();
    if (!request.ok) {
      const { message } = response;
      throw new Error(message);
    }
    let filtered;
    const { collection, caption, startDate, endDate, hideRange, tags } = filter;

    filtered =
      caption.length > 0
        ? response.filter((photo: MockFile) =>
            photo.caption.toLowerCase().trim().includes(caption!.toLowerCase())
          )
        : response;
    console.log(filtered.length);
    const tagsArr = tags.split(",");

    filtered =
      tags.length > 0
        ? filtered.filter((photo: MockFile) =>
            tagsArr?.every((tag: string) => photo.tags.includes(tag))
          )
        : filtered;
    console.log(filtered.length);
    if (!collection.includes("All collections"))
      filtered = filtered.filter(
        (photo: MockFile) => photo.collection.trim() === collection
      );

    if (!hideRange) {
      filtered = filtered.filter(
        (photo: MockFile) => photo.date >= startDate && photo.date <= endDate
      );
    }
    console.log(filtered.length);
    return filtered;
  }
);

export const getCount = createAsyncThunk(
  "get-count",
  async (filter: TFilterState) => {
    console.log("counting");
    const request = await fetch("188.json");
    const response = await request.json();
    if (!request.ok) {
      const { message } = response;
      throw new Error(message);
    }
    let filtered;
    const { collection, caption, startDate, endDate, hideRange, tags } = filter;

    filtered =
      caption.length > 0
        ? response.filter((photo: MockFile) =>
            photo.caption.toLowerCase().trim().includes(caption!.toLowerCase())
          )
        : response;

    const tagsArr = tags.split(",");

    filtered =
      tags.length > 0
        ? filtered.filter((photo: MockFile) =>
            tagsArr?.every((tag: string) => photo.tags.includes(tag))
          )
        : filtered;

    if (!collection.includes("All collections"))
      filtered = filtered.filter(
        (photo: MockFile) => photo.collection.trim() === collection
      );

    if (!hideRange) {
      filtered = filtered.filter(
        (photo: MockFile) => photo.date >= startDate && photo.date <= endDate
      );
    }

    return filtered.length;
  }
);
export const initialPhotosState: TPhotosState = {
  data: null,
  loading: false,
  error: false,
  message: null,
  count: null,
};

export const photosSlice = createSlice({
  name: "photos",
  initialState: initialPhotosState,
  reducers: {
    resetPhotos: () => initialPhotosState,
  },
  extraReducers(builder) {
    builder
      .addCase(getCount.fulfilled, (state, action) => {
        state.count = action.payload;
      })
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
