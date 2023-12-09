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
    const { collection, caption, startDate, endDate, hideRange, tags } = filter;

    /*   if (type === "caption") { */
    filtered =
      caption.length > 0
        ? response.filter((photo: MockFile) =>
            photo.caption.toLowerCase().includes(caption!.toLowerCase())
          )
        : response;
    /* } */

    console.log(filtered);

    /*   else if (type === "tags") { */
    const tagsArr = tags.split(",");
    console.log(tagsArr);
    filtered =
      tagsArr.length > 0
        ? filtered.filter((photo: MockFile) =>
            tagsArr?.every((tag: string) => photo.tags.includes(tag))
          )
        : filtered;
    /* } */

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
