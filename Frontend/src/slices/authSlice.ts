
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { setAccessToken } from "../api/instance.ts";
import type { User } from "../types/entities/User.ts";
import type { RootState } from "./index.ts";


type AuthState = {
    user: User | null,
    token: string | null,
    isLoading: boolean
}

const slice = createSlice({
    name: 'auth',
    initialState: { user: null, token: null, isLoading: false } as AuthState,
    reducers: {
        setCredential: (
            state,
            {
                payload: { user, token },
            }: PayloadAction<{ user: User | null; token: string }>,
        ) => {
            state.user = user
            state.token = token
            setAccessToken(token)
        },
        logout: (state) => {
            state.user = null
            state.token = null
            setAccessToken(null)
        }
    },
})

export const { setCredential, logout } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user