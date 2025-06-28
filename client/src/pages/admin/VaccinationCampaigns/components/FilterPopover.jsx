import React, { useState } from "react";
import {
  Button,
  Popover,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Alert,
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

  // Date picker states with error handling
  const [dateFromValue, setDateFromValue] = useState(() => {
    try {
      return params.startDateFrom ? new Date(params.startDateFrom) : null;
    } catch (error) {
      console.warn('Invalid startDateFrom:', params.startDateFrom);
      return null;
    }
  });

  const [dateToValue, setDateToValue] = useState(() => {
    try {
      return params.startDateTo ? new Date(params.startDateTo) : null;
    } catch (error) {
      console.warn('Invalid startDateTo:', params.startDateTo);
      return null;
    }
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
    
    // Validation: Reset end date if start date is after end date
    if (date && dateToValue && dayjs(date).isAfter(dateToValue)) {
      setDateToValue(null);
      handleFilterChange('startDateTo', '');
    }
  };

  const handleDateToChange = (date) => {
    setDateToValue(date);
    const dateString = date ? dayjs(date).format('YYYY-MM-DD') : '';
    handleFilterChange('startDateTo', dateString);
    
    // Validation: Reset start date if end date is before start date
    if (date && dateFromValue && dayjs(date).isBefore(dateFromValue)) {
      setDateFromValue(null);
      handleFilterChange('startDateFrom', '');
    }
  };

  const applyFilters = () => {
    // Only send filters with values
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
  const hasActiveFilters = filters.status || filters.startDateFrom || filters.startDateTo;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterIcon />}
        onClick={handleClick}
        color={hasActiveFilters ? "primary" : "inherit"}
         size="medium"
         sx={{ 
          height: '40px', // Cùng chiều cao với SearchFilter
          minWidth: '120px',
          fontWeight: 'normal'
        }}
      >
        Bộ lọc {hasActiveFilters && `(${Object.values(filters).filter(Boolean).length})`}
      </Button>
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 3, minWidth: 500 }}>
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
              
            </Select>
          </FormControl>

          {/* Date Filters */}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Từ ngày"
              value={dateFromValue}
              onChange={handleDateFromChange}
              maxDate={dateToValue || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { mb: 2 }
                }
              }}
            />
            
            <DatePicker
              label="Đến ngày"
              value={dateToValue}
              onChange={handleDateToChange}
              minDate={dateFromValue || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { mb: 2 }
                }
              }}
            />
          </LocalizationProvider>

          {/* Validation Warning */}
          {dateFromValue && dateToValue && dayjs(dateFromValue).isAfter(dateToValue) && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Ngày bắt đầu không thể sau ngày kết thúc
            </Alert>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={clearFilters} variant="text" disabled={!hasActiveFilters}>
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
