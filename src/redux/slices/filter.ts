import { createSlice } from "@reduxjs/toolkit";

import { TFilterState } from "../../utils/types";

export const initialFilterState: TFilterState = {
  caption: "",
  tags: "",
  startDate: "1890",
  endDate: "1938",
  hideRange: true,
  collection: "All collections",
  directRefer: true,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState: initialFilterState,
  reducers: {
    resetFilter: () => initialFilterState,
    setDate: (state, action) => {
      return { ...state, ...action.payload };
    },
    setFilter: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { resetFilter, setFilter, setDate } = filterSlice.actions;
export default filterSlice.reducer;
