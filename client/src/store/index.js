import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import managerVaccinationReducer from "./managerVaccinationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    managerVaccination: managerVaccinationReducer,
  },
});

export default store;
