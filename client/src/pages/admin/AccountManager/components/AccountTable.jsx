import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Chip,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import userApi from "../../../../api/userApi";
import useQueryParams, {
  createQueryParams,
} from "../../../../hooks/query/useQueryParams";
import { useNavigate } from "react-router";
import SearchFilter from "./SearchFilter";
import FilterPopover from "./FilterPopover";

const AccountTable = () => {
  const params = useQueryParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers({ ...params }),
  });

  const handleChangePage = (event, newPage) => {
    const newQuery = createQueryParams({
      ...params,
      page: newPage,
    });
    navigate({ search: newQuery });
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <Typography color="error" align="center" sx={{ mt: 2 }}>
        Error: {error?.message || "Failed to load users."}
      </Typography>
    );
  }

  const users = data?.data?.records || [];
  const total = data?.data?.total || 0;
  const page = data?.data?.page || 0;
  const totalPages = data?.data?.totalPages || 0;
  const limit = data?.data?.limit || 0;

  return (
    <Box>
      {/* Search and Filter Bar */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <SearchFilter />
        <FilterPopover />
      </Box>

      {/* Results Summary */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {users.length} of {total} users
        </Typography>
        {(params.search || params.roleId || params.isActive) && (
          <Chip
            label="Filters applied"
            color="primary"
            size="small"
            variant="outlined"
          />
        )}
      </Box>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.roleId}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Active" : "Inactive"}
                        color={user.isActive ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.updatedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(event, newPage) => handleChangePage(event, newPage - 1)}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AccountTable;
