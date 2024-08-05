import { configureStore } from '@reduxjs/toolkit'
import LookupUpdate from './Redux/MasterDataUpdateSlice/LookupUpdate'
import LabelUpdateSlice from './Redux/LabelUpdate/LabelUpdateSlice'
import getLookupSlice from './Redux/MasterDataUpdateSlice/getLookupSlice'
import PopupSlice from './Redux/PopupSlice/PopupSlice'
// ...

export const store = configureStore({
  reducer: {
    lookupDataFlags: LookupUpdate,
    LabelUpdate:LabelUpdateSlice,
    fetchGetLookupData: getLookupSlice,
    popupSlice: PopupSlice
  },
})
