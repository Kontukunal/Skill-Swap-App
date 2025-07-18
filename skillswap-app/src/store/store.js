import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import exchangeReducer from "../features/exchange/exchangeSlice";
import communityReducer from "../features/community/communitySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    exchange: exchangeReducer,
    community: communityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
