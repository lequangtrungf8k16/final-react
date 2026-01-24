import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import postReducer from "./slices/postSlice";
import chatReducer from "./slices/chatSlice";
import commentReducer from "./slices/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    chat: chatReducer,
    comment: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
