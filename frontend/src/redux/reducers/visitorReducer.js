import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  visitors: {},
  allVisitors: {},
  uniqueVisitor: {},
  error: null,
  message: null,
};

export const visitorReducer = createReducer(initialState, {
  INC_VISITOR_COUNT_REQUEST: (state) => {
    state.loading = true;
  },
  INC_VISITOR_COUNT_SUCCESS: (state, action) => {
    state.loading = false;
    state.message = action.payload.message;
    state.visitors = action.payload.visitors;
    state.allVisitors = action.payload.allVisitors;
    state.uniqueVisitor = action.payload.uniqueVisitor;
  },
  INC_VISITOR_COUNT_FAILURE: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  CLEAR_ERROR: (state) => {
    state.error = null;
  },
  CLEAR_MESSAGE: (state) => {
    state.message = null;
  },
});
