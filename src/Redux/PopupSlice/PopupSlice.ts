import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false
}

const popupOpenSlice = createSlice({
    name: 'popupSlice',
    initialState: initialState,
    reducers: {
        setPdfPopupOpen: (state, action) => {
            state.isOpen = action.payload
        }
    }
})

export const { setPdfPopupOpen } = popupOpenSlice.actions;
export default popupOpenSlice.reducer;