import { configureStore } from '@reduxjs/toolkit'
import LookupUpdate from './Redux/MasterDataUpdateSlice/LookupUpdate'
import LabelUpdateSlice from './Redux/LabelUpdate/LabelUpdateSlice'
import getLookupSlice from './Redux/MasterDataUpdateSlice/getLookupSlice'
// ...

export const store = configureStore({
  reducer: {
    lookupDataFlags: LookupUpdate,
    LabelUpdate:LabelUpdateSlice,
    fetchGetLookupData: getLookupSlice
  },
})
