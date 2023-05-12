import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { TPhotosState } from "../../utils/types";

export const fetchPhotos = createAsyncThunk("fetch-photos", async () => {
  const request = await fetch("188.json");
  const response = await request.json();
  if (!request.ok) {
    const { message } = response;
    throw new Error(message);
  }
  return response;
});

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
