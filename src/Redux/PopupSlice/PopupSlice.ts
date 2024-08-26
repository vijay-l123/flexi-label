import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    isError: false
}

const popupOpenSlice = createSlice({
    name: 'popupSlice',
    initialState: initialState,
    reducers: {
        setPdfPopupOpen: (state, action) => {
            state.isOpen = action.payload
        },
        setErrorFlag: (state, action) => {
            state.isError = action.payload
        }
    }
})

export const { setPdfPopupOpen, setErrorFlag } = popupOpenSlice.actions;
export default popupOpenSlice.reducer;