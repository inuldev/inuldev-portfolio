import { configureStore } from "@reduxjs/toolkit";
import { loginReducer, updateReducer, userReducer } from "./reducers/User";
import { visitorReducer } from "./reducers/visitorReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    login: loginReducer,
    update: updateReducer,
    visitorStat: visitorReducer,
  },
});

export default store;
