import { configureStore } from '@reduxjs/toolkit'
import LookupUpdate from './Redux/MasterDataUpdateSlice/LookupUpdate'
import LabelUpdateSlice from './Redux/LabelUpdate/LabelUpdateSlice'
import getLookupSlice from './Redux/MasterDataUpdateSlice/getLookupSlice'
import PopupSlice from './Redux/PopupSlice/PopupSlice'
import uploadDocuments from './Redux/Documents/uploadDocuments'
import updateDocuments from './Redux/Documents/updateDocuments'
// ...

export const store = configureStore({
  reducer: {
    lookupDataFlags: LookupUpdate,
    LabelUpdate:LabelUpdateSlice,
    fetchGetLookupData: getLookupSlice,
    popupSlice: PopupSlice,
    documentUpload: uploadDocuments,
    documentUpdate: updateDocuments,
  },
})
