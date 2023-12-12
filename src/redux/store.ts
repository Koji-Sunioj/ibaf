import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { isAnyOf } from "@reduxjs/toolkit";

import { setFilter } from "./slices/filter";

import filterReducer from "./slices/filter";
import photosReducer, { fetchPhotos, getCount } from "./slices/photos";
import { TAppState } from "../utils/types";

const fetchMiddleWare = createListenerMiddleware();

fetchMiddleWare.startListening({
  matcher: isAnyOf(setFilter),
  effect: (action, state) => {
    const { filter } = state.getState() as TAppState;
    state.dispatch(getCount(filter));
  },
});

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    photos: photosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(fetchMiddleWare.middleware),
});

export type AppDispatch = typeof store.dispatch;
