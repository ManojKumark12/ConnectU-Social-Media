import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slice";
import {
  persistStore,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "user",   // key name in localStorage
  storage,
};
const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
});

export const persistor = persistStore(store);