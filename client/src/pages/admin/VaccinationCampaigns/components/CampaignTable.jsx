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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import vaccinationCampaignApi from "../../../../api/vaccinationCampaignApi";
import useQueryParams, {
  createQueryParams,
} from "../../../../hooks/query/useQueryParams";
import { useNavigate } from "react-router";
import SearchFilter from "./SearchFilter";
import FilterPopover from "./FilterPopover";

const CampaignTable = () => {
  const params = useQueryParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vaccination-campaigns-search", params],
    queryFn: () => vaccinationCampaignApi.SearchCamPaigns({ ...params }),
  });

  const handleChangePage = (event, newPage) => {
    const newQuery = createQueryParams({
      ...params,
      page: newPage,
    });
    navigate({ search: newQuery });
  };

  const handleViewDetail = (campaign) => {
    navigate(`/admin/vaccination-campaigns/${campaign._id}`, {
      state: { campaignData: campaign }
    });
  };

  const handleEdit = (campaign) => {
    navigate(`/admin/vaccination-campaigns/edit/${campaign._id}`, {
      state: { campaignData: campaign }
    });
  };

  // ✅ Hàm chuyển đổi status sang tiếng Việt
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
      case 'active':
        return 'Đang hoạt động';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'pending':
        return 'Chờ xử lý';
      case 'planned':
      case 'planning':
        return 'Đã lên kế hoạch';
      default:
        return status || 'Không xác định';
    }
  };

  // Status color mapping - đã cập nhật
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
      case 'active':
      case 'đang hoạt động':
        return 'success';
      case 'completed':
      case 'hoàn thành':
        return 'info';
      case 'cancelled':
      case 'đã hủy':
        return 'error';
      case 'pending':
      case 'chờ xử lý':
        return 'warning';
      case 'planned':
      case 'planning':
      case 'đã lên kế hoạch':
        return 'info';
      default:
        return 'default';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      return 'N/A';
    }
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
        Error: {error?.message || "Failed to load vaccination campaigns."}
      </Typography>
    );
  }

  const campaigns = data?.data?.records || [];
  const total = data?.data?.total || 0;
  const page = data?.data?.page || 1;
  const totalPages = data?.data?.totalPages || 0;

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
          Hiển thị {campaigns.length} trong tổng số {total} chiến dịch
        </Typography>
        {(params.keyword || params.status || params.startDateFrom || params.startDateTo) && (
          <Chip
            label="Đã áp dụng bộ lọc"
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
                <TableCell>Tên vaccine</TableCell>
                <TableCell>Loại vaccine</TableCell>
                <TableCell>Đối tượng</TableCell>
                <TableCell>Ngày bắt đầu</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có chiến dịch tiêm chủng nào.
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {campaign.vaccineName || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>{campaign.vaccineType || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {campaign.targetAudience || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(campaign.startDate)}</TableCell>
                    <TableCell>
                      {/* ✅ Sử dụng getStatusText để hiển thị tiếng Việt */}
                      <Chip
                        label={getStatusText(campaign.status)}
                        color={getStatusColor(campaign.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {campaign.createdBy?.name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetail(campaign)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(campaign)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
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
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CampaignTable;
