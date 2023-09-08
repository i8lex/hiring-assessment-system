import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authSlice from "./auth/authSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/lib/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import { authApi } from "./auth/authApi";
import { testsApi } from "./tests/testsApi";
import { filesApi } from "./files/filesApi";
import { usersApi } from "./users/usersApi";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "isAuthenticated", "role", "answers", "userId"],
};

export const store = configureStore({
  reducer: {
    // @ts-ignore
    auth: persistReducer(authPersistConfig, authSlice),
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [testsApi.reducerPath]: testsApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
  },

  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      testsApi.middleware,
      filesApi.middleware,
      usersApi.middleware,
    ),
  ],
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
