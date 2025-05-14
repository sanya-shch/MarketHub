import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    PersistConfig,
    REGISTER,
    REHYDRATE,
    persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { cartSlice } from './cart/cart.slice';

const persistConfig: PersistConfig<any> = {
    key: 'react-shop-root',
    storage,
    whitelist: ['cart'],
};

const isClient = typeof window !== undefined;

const combinedReducers = combineReducers({
    cart: cartSlice.reducer,
});

let rootReducer = combinedReducers;

if (isClient) {
    const { persistReducer } = require('redux-persist');

    rootReducer = persistReducer(persistConfig, combinedReducers);
}

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);

export type TypeRootState = ReturnType<typeof rootReducer>;
