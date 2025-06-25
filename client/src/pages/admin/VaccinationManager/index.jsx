import React, { useState } from "react";
import FilterPopover from "./components/FilterPopover";

import SearchFilter from "./components/SearchFilter";
import Table from "./components/Table";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import CreateVaccinationForm from "./components/CreateVaccinationForm";
import { useDispatch, useSelector } from "react-redux";
import { clearIsOpen, setIsOpen } from "../../../store/managerVaccinationSlice";

const VaccinationManager = () => {
  const dispatch = useDispatch();
  const { isOpen, vaccination } = useSelector(
    (state) => state.managerVaccination
  );
  const handleClose = () => {
    dispatch(clearIsOpen());
  };
  const handleOpen = () => {
    dispatch(setIsOpen(true));
  };
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={handleOpen}
      >
        Tạo chương trình tiêm chủng mới
      </Button>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SearchFilter />
        <FilterPopover />
      </div>
      <Table />
      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {vaccination
            ? "Cập nhật chương trình tiêm chủng"
            : "Tạo chương trình tiêm chủng mới"}
        </DialogTitle>
        <DialogContent>
          <CreateVaccinationForm onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VaccinationManager;
