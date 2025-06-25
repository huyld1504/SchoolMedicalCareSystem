import React, { useState } from "react";
import CampaignTable from "./components/CampaignTable";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Vaccines as VaccineIcon } from "@mui/icons-material";

const VaccinationCampaigns = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VaccineIcon color="primary" />
          Quản lý Chiến dịch Tiêm chủng
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả các chiến dịch tiêm chủng trong hệ thống
        </Typography>
      </Box>

    

      <CampaignTable />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Tạo chiến dịch tiêm chủng mới</DialogTitle>
      
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VaccinationCampaigns;
