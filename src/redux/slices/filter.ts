import { createSlice } from "@reduxjs/toolkit";

import { TFilterState } from "../../utils/types";

export const initialFilterState: TFilterState = {
  query: "",
  type: "caption",
  startDate: "1890",
  endDate: "1938",
  hideRange: true,
  collection: "All collections",
};

export const filterSlice = createSlice({
  name: "filter",
  initialState: initialFilterState,
  reducers: {
    resetFilter: () => initialFilterState,
    setFilter: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { resetFilter, setFilter } = filterSlice.actions;
export default filterSlice.reducer;
