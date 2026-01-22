import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postSlice";
import commentReducer from "./slices/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    comment: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
