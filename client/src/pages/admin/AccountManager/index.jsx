import React, { useState } from "react";
import AccountTable from "./components/AccountTable";
import CreateAccountForm from "./components/CreateAccountForm";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const AccountManager = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={handleOpen}
      >
        Tạo tài khoản mới
      </Button>
      <AccountTable />
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo tài khoản mới</DialogTitle>
        <DialogContent>
          <CreateAccountForm onSuccess={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccountManager;
