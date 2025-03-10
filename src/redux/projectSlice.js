import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false, 
    error: false,
}
// still initialized as user for now, change later.
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
        },
        loginSuccess: (state, action) => {
            state.loading = false
            state.currentUser = action.payload
        },
        loginFailure: (state) => {
            state.loading = false
            state.error = true
        },
        logout: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = false
        },
    }
});

export const {loginStart, loginSuccess, loginFailure, logout} = projectSlice.actions

export default userSlice.reducer;