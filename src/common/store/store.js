import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, applyMiddleware, compose } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { userProfileSlice } from './slices/user/userSlice';

const persistConfig = {
    key: 'root',
    storage,
};

const appReducer = combineReducers({
    user: userProfileSlice.reducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT') {
        setInterval(() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        }, 500)
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
});

export const resetStore = () => {
    store.dispatch({ type: 'LOGOUT' });
}

export const persistor = persistStore(store);

export default store;