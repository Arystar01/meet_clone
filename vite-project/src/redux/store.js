import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice.js";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  authStore: authSlice, // Ensure this is correctly exported from AuthSlice.js
});

// Apply persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store); 

export default store;
