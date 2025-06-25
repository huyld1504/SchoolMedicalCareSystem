import React, { useState } from "react";
import useQueryParams, {
  createQueryParams,
} from "../../../../hooks/query/useQueryParams";
import { useNavigate } from "react-router";
import {
  Button,
  Popover,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Stack,
  Typography,
} from "@mui/material";

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "planned", label: "Kế hoạch" },
  { value: "ongoing", label: "Đang diễn ra" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const FilterPopover = () => {
  const params = useQueryParams();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({
    status: params.status || "",
    startDateFrom: params.startDateFrom || "",
    startDateTo: params.startDateTo || "",
  });

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (field, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    const newQuery = createQueryParams({
      ...params,
      ...filterValues,
      page: 1,
    });
    navigate({ search: newQuery });
    handleFilterClose();
  };

  const handleResetFilters = () => {
    setFilterValues({ status: "", startDateFrom: "", startDateTo: "" });
  };

  return (
    <>
      <Button variant="outlined" onClick={handleFilterClick} sx={{ mr: 2 }}>
        Lọc
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 280 }}>
          <Typography variant="subtitle1" mb={1}>
            Bộ lọc
          </Typography>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                value={filterValues.status}
                label="Trạng thái"
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Từ ngày"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filterValues.startDateFrom}
              onChange={(e) =>
                handleFilterChange("startDateFrom", e.target.value)
              }
              fullWidth
            />
            <TextField
              label="Đến ngày"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filterValues.startDateTo}
              onChange={(e) =>
                handleFilterChange("startDateTo", e.target.value)
              }
              fullWidth
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button onClick={handleResetFilters}>Đặt lại</Button>
              <Button variant="contained" onClick={handleApplyFilters}>
                Áp dụng
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </>
  );
};

export default FilterPopover;
