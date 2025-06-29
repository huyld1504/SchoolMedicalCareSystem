import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vaccination: null,
  isOpen: false,
  isPreviewDrawerOpen: false,
  previewCampaignId: null,
  isPreviewOpen: false,
};

const managerVaccinationSlice = createSlice({
  name: "managerVaccination",
  initialState,
  reducers: {
    setVaccination: (state, action) => {
      state.vaccination = action.payload;
    },
    clearVaccination: (state) => {
      state.vaccination = null;
    },
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    clearIsOpen: (state) => {
      state.isOpen = false;
    },
    setIsPreviewDrawerOpen: (state, action) => {
      state.isPreviewDrawerOpen = action.payload;
    },
    clearIsPreviewDrawerOpen: (state) => {
      state.isPreviewDrawerOpen = false;
    },
    setPreviewCampaignId(state, action) {
      state.previewCampaignId = action.payload;
    },
    setIsPreviewOpen(state, action) {
      state.isPreviewOpen = action.payload;
    },
  },
});

export const {
  setVaccination,
  clearVaccination,
  setIsOpen,
  clearIsOpen,
  setPreviewCampaignId,
  setIsPreviewOpen,
} = managerVaccinationSlice.actions;

export default managerVaccinationSlice.reducer;
