import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    PersistConfig,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { cartSlice } from './cart/cart.slice';

const combinedReducers = combineReducers({
    cart: cartSlice.reducer,
});

const persistConfig: PersistConfig<ReturnType<typeof combinedReducers>> = {
    key: 'react-shop-root',
    storage,
    whitelist: ['cart'],
};

// redux-persist's default storage is a no-op on the server, so the reducer can
// be wrapped unconditionally (the old `typeof window !== undefined` check was
// always true anyway).
const rootReducer = persistReducer(persistConfig, combinedReducers);

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

export type TypeRootState = ReturnType<typeof combinedReducers>;
