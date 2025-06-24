import React, { useState } from "react";
import {
  Button,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { FilterList as FilterIcon } from "@mui/icons-material";
import useQueryParams, {
  createQueryParams,
} from "../../../../hooks/query/useQueryParams";
import { useNavigate } from "react-router";
import { useQueryRoles } from "../../../../hooks/query/queryRole";

const FilterPopover = () => {
  const params = useQueryParams();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({
    roleId: params.roleId || "",
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
  const {
    data: roles,
    isLoading: loadingRoles,
    error: rolesError,
  } = useQueryRoles();
  const handleApplyFilters = () => {
    const newQuery = createQueryParams({
      ...params,
      ...filterValues,
      page: 1, // Reset to first page when filtering
    });
    navigate({ search: newQuery });
    handleFilterClose();
  };

  const handleClearFilters = () => {
    setFilterValues({
      roleId: "",
      isActive: "",
    });
    const newQuery = createQueryParams({
      ...params,
      roleId: undefined,
      isActive: undefined,
      page: 1,
    });
    navigate({ search: newQuery });
    handleFilterClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterIcon />}
        onClick={handleFilterClick}
        sx={{ minWidth: 120 }}
      >
        Filter
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filter Options
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={filterValues.roleId}
              label="Role"
              onChange={(e) => handleFilterChange("roleId", e.target.value)}
            >
              <MenuItem value="">All Roles</MenuItem>
              {roles?.data?.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleClearFilters}>
              Clear
            </Button>
            <Button variant="contained" onClick={handleApplyFilters}>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default FilterPopover;
