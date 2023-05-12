import { configureStore } from "@reduxjs/toolkit";

import filterReducer from "./slices/filter";
import photosReducer from "./slices/photos";

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    photos: photosReducer,
  },
});
