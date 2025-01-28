import { configureStore } from '@reduxjs/toolkit'
import familyReducer from "./features/FamilySlice";



export const store = () => {
    return configureStore({
        reducer: {
            family: familyReducer
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']