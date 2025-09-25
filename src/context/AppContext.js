import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
    currency: 'HKD',
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_CURRENCY':
            return { ...state, currency: action.payload };
        default:
            return state;
    }
}

const AppContext = createContext();

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
