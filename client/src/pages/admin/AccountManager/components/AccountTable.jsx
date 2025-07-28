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
import { useQueryRoles } from "../../../../hooks/query/queryRole";

const AccountTable = () => {
  const params = useQueryParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers({ ...params }),
  });

  const {
    data: roles,
  } = useQueryRoles();

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
        Lỗi: {error?.message || "Không thể tải danh sách người dùng."}
      </Typography>
    );
  }

  const users = data?.data?.records || [];
  const total = data?.data?.total || 0;
  const page = data?.data?.page || 0;
  const totalPages = data?.data?.totalPages || 0;

  const getRoleNameById = (roleId) => {
    const role = roles?.data?.find((r) => r._id === roleId);
    return role ? role.name : "Không rõ";
  };

  return (
    <Box>
      {/* Thanh tìm kiếm và bộ lọc */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <SearchFilter />
        <FilterPopover />
      </Box>

      {/* Thông tin tổng */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Hiển thị {users.length} trong tổng số {total} người dùng
        </Typography>
      </Box>

      {/* Bảng dữ liệu */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày cập nhật</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không tìm thấy người dùng nào.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleNameById(user.roleId)}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                        color={user.isActive ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {new Date(user.updatedAt).toLocaleString("vi-VN")}
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
