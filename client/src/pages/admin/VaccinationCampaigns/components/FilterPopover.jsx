import React, { useState } from "react";
import {
  Button,
  Popover,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { FilterList as FilterIcon } from "@mui/icons-material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import dayjs from 'dayjs';
import useQueryParams, {
  createQueryParams,
} from "../../../../hooks/query/useQueryParams";
import { useNavigate } from "react-router";

const FilterPopover = () => {
  const params = useQueryParams();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  // Initialize filter state from URL params
  const [filters, setFilters] = useState({
    status: params.status || "",
    startDateFrom: params.startDateFrom || "",
    startDateTo: params.startDateTo || "",
  });

  // Date picker states
  const [dateFromValue, setDateFromValue] = useState(() => {
    return params.startDateFrom ? new Date(params.startDateFrom) : null;
  });
  const [dateToValue, setDateToValue] = useState(() => {
    return params.startDateTo ? new Date(params.startDateTo) : null;
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  const handleDateFromChange = (date) => {
    setDateFromValue(date);
    const dateString = date ? dayjs(date).format('YYYY-MM-DD') : '';
    handleFilterChange('startDateFrom', dateString);
  };

  const handleDateToChange = (date) => {
    setDateToValue(date);
    const dateString = date ? dayjs(date).format('YYYY-MM-DD') : '';
    handleFilterChange('startDateTo', dateString);
  };
  const applyFilters = () => {
    // Chỉ gửi các filters có giá trị
    const filteredParams = {};

    if (filters.status) {
      filteredParams.status = filters.status;
    }

    if (filters.startDateFrom) {
      filteredParams.startDateFrom = filters.startDateFrom;
    }

    if (filters.startDateTo) {
      filteredParams.startDateTo = filters.startDateTo;
    }

    const newQuery = createQueryParams({
      ...params,
      ...filteredParams,
      page: 1, // Reset to first page when filtering
    });
    navigate({ search: newQuery });
    handleClose();
  };
  const clearFilters = () => {
    setFilters({
      status: "",
      startDateFrom: "",
      startDateTo: "",
    });
    setDateFromValue(null);
    setDateToValue(null);

    const { status, startDateFrom, startDateTo, ...otherParams } = params;
    const newQuery = createQueryParams({
      ...otherParams,
      page: 1,
    });
    navigate({ search: newQuery });
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterIcon />}
        onClick={handleClick}
      >
        Bộ lọc
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Bộ lọc tìm kiếm
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Status Filter */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filters.status}
              label="Trạng thái"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="ongoing">Đang hoạt động</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
              <MenuItem value="planning">Chờ xử lý</MenuItem>
            </Select>
          </FormControl>

          {/* Date From Filter */}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Từ ngày"
              value={dateFromValue}
              onChange={handleDateFromChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { mb: 2 }
                }
              }}
            />
          </LocalizationProvider>

          {/* Date To Filter */}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Đến ngày"
              value={dateToValue}
              onChange={handleDateToChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { mb: 2 }
                }
              }}
            />
          </LocalizationProvider>

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={clearFilters} variant="text">
              Xóa bộ lọc
            </Button>
            <Button onClick={applyFilters} variant="contained">
              Áp dụng
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default FilterPopover;
