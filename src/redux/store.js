// src/store/index.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

// 1️⃣ Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// 2️⃣ Persist config
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// 3️⃣ Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ needed for redux-persist
    }),
});

// 5️⃣ Create persistor
export const persistor = persistStore(store);
