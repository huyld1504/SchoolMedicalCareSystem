import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Collapse,
} from "@mui/material";
import {
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

import vaccinationCampaignApi from "../../../../api/vaccinationCampaignApi";
import { formatnoTime } from "../../../../utils/date.utils";
import { unpackExcelStudentIds } from "../../../../utils/unpackExcelStudentIds";
import vaccinationApi from "../../../../api/vaccinationApi";

const DetailView = ({ campaign }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [participationPage, setParticipationPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    parentConsent: "",
    vaccinationStatus: "",
    consentDateFrom: null,
    consentDateTo: null,
    vaccinationDateFrom: null,
    vaccinationDateTo: null,
  });

  // Query for participants from campaign
  const {
    data: participationsResponse,
    isLoading: participationsLoading,
    refetch,
  } = useQuery({
    queryKey: ["campaign-participations", campaign._id],
    queryFn: () =>
      vaccinationCampaignApi.GetAllParticipationsInCampaign(campaign._id),
    enabled: !!campaign._id,
  });
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportMsg("");
    try {
      const studentIds = await unpackExcelStudentIds(file);
      if (!studentIds.length) throw new Error("File không có studentId hợp lệ");
      const data = {
        studentIds: studentIds,
      };
      const res = await vaccinationApi.addStudentToVaccination(
        previewCampaignId,
        data
      );
      console.log("Import thành công:", res);
      setImportMsg("Import thành công!");
      refetch();
    } catch (err) {
      setImportMsg("Import thất bại: " + err.response.data.message);
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };
  // Get the participations data from the response
  const participationsData = participationsResponse?.data?.records || [];
  const totalParticipants = participationsResponse?.data?.total;
  const completedCount = participationsData.filter(
    (p) => p.vaccinationStatus === "completed"
  ).length;

  // Apply filters and search locally
  const filteredParticipations = participationsData.filter((participant) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const studentInfo = participant.student;
      const studentName = studentInfo?.name?.toLowerCase() || "";
      const studentCode = studentInfo?.studentCode?.toLowerCase() || "";

      if (
        !studentName.includes(searchLower) &&
        !studentCode.includes(searchLower)
      ) {
        return false;
      }
    }

    // Parent consent filter
    if (
      filters.parentConsent &&
      participant.parentConsent !== filters.parentConsent
    ) {
      return false;
    }

    // Vaccination status filter
    if (
      filters.vaccinationStatus &&
      participant.vaccinationStatus !== filters.vaccinationStatus
    ) {
      return false;
    }

    return true;
  });
  const [importing, setImporting] = React.useState(false);
  const [importMsg, setImportMsg] = React.useState("");
  const fileInputRef = React.useRef();

  // Apply pagination locally
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredParticipations.length / itemsPerPage);
  const startIndex = (participationPage - 1) * itemsPerPage;
  const paginatedParticipations = filteredParticipations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Event handlers
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setParticipationPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setParticipationPage(1);
  };

  const handleParticipationPageChange = (event, value) => {
    setParticipationPage(value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setParticipationPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      parentConsent: "",
      vaccinationStatus: "",
      consentDateFrom: null,
      consentDateTo: null,
      vaccinationDateFrom: null,
      vaccinationDateTo: null,
    });
    setParticipationPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null
  );

  // Utility functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
      case "đang hoạt động":
        return "success";
      case "completed":
      case "hoàn thành":
        return "info";
      case "cancelled":
      case "đã hủy":
        return "error";
      case "pending":
      case "chờ xử lý":
        return "warning";
      case "planned":
      case "đã lên kế hoạch":
        return "info";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("vi-VN");
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "grey.50",
        py: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px", // Giới hạn chiều rộng tối đa
          px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          mx: "auto", // Căn giữa container
        }}
      >
        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
          {/* Header Section - Tên chiến dịch */}
          <Grid item xs={12}>
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  mb: 1,
                }}
              >
                {campaign.vaccineName || "Chiến dịch tiêm chủng"}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {campaign.vaccineType} - {campaign.targetAudience}
              </Typography>
              <Chip
                label={campaign.status || "N/A"}
                color={getStatusColor(campaign.status)}
                size="large"
                sx={{ fontSize: "1rem", px: 3, py: 1 }}
              />
            </Box>
          </Grid>

          {/* Row 2: Thông tin chiến dịch (full width) */}
          <Grid item xs={12}>
            <Card sx={{ width: "1010px" }}>
              <CardContent sx={{ width: "100%" }}>
                {/* Header chính */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <DescriptionIcon color="primary" />
                    Thông tin chiến dịch
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Section 1: Thông tin cơ bản */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}
                  >
                    Thông tin cơ bản
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Loại vaccine
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                          {campaign.vaccineType || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Đối tượng mục tiêu
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                          {campaign.targetAudience || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày bắt đầu
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                          {formatnoTime(campaign.startDate)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày kết thúc
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                          {formatnoTime(campaign.endDate)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Người tạo
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                          {campaign.createdBy?.name || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Section 2: Lịch trình */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: "text.primary",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CalendarIcon color="primary" fontSize="small" />
                    Lịch trình
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày bắt đầu
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(campaign.startDate)}
                        </Typography>
                      </Box>
                    </Grid>

                    {campaign.endDate && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Ngày kết thúc
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(campaign.endDate)}
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {campaign.schedule && campaign.schedule.length > 0 && (
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Lịch chi tiết
                        </Typography>
                        <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                          <List dense>
                            {campaign.schedule.map((scheduleItem, index) => (
                              <ListItem key={index} divider>
                                <ListItemText
                                  primary={`${formatDateTime(
                                    scheduleItem.date
                                  )}`}
                                  secondary={
                                    scheduleItem.note || "Không có ghi chú"
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Section 3: Thông tin bổ sung */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: "text.primary",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <InfoIcon color="primary" fontSize="small" />
                    Thông tin bổ sung
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày tạo
                        </Typography>
                        <Typography variant="body2">
                          {formatDateTime(campaign.createdAt)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Cập nhật lần cuối
                        </Typography>
                        <Typography variant="body2">
                          {formatDateTime(campaign.updatedAt)}
                        </Typography>
                      </Box>
                    </Grid>

                    {campaign.notes && (
                      <Grid item xs={12}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Ghi chú
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              p: 2,
                              backgroundColor: "grey.50",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "grey.200",
                            }}
                          >
                            {campaign.notes}
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {campaign.description && (
                      <Grid item xs={12}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Mô tả
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              p: 2,
                              backgroundColor: "grey.50",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "grey.200",
                            }}
                          >
                            {campaign.description}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Row 3: Danh sách tham gia (full width) */}
          <Grid item xs={12}>
            <Card sx={{ width: "1010px" }}>
              <CardContent sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <GroupIcon color="primary" />
                    Danh sách tham gia
                    {totalParticipants > 0 && (
                      <Chip
                        label={`${filteredParticipations.length}/${totalParticipants} người`}
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Search và Filter */}
                <Box sx={{ mb: 3 }}>
                  {/* Search Box */}
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm theo tên hoặc mã học sinh..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={handleClearSearch}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Filter Controls */}
                  <div>
                    {" "}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FilterIcon />}
                        endIcon={
                          showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />
                        }
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        Bộ lọc
                      </Button>
                      {hasActiveFilters && (
                        <Chip
                          label="Có bộ lọc đang áp dụng"
                          color="primary"
                          size="small"
                          onDelete={handleClearFilters}
                        />
                      )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Button
                        variant="outlined"
                        component="label"
                        disabled={importing}
                        sx={{ mr: 2 }}
                      >
                        Import file Excel
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          hidden
                          ref={fileInputRef}
                          onChange={handleImportExcel}
                        />
                      </Button>
                      {importing && <CircularProgress size={20} />}
                      {importMsg && (
                        <Typography
                          color={
                            importMsg.includes("thành công")
                              ? "success.main"
                              : "error.main"
                          }
                          sx={{ ml: 2 }}
                        >
                          {importMsg}
                        </Typography>
                      )}
                    </Box>
                  </div>

                  <Collapse in={showFilters}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          sx={{ width: "300px" }}
                        >
                          <FormControl fullWidth size="small">
                            <InputLabel>Đồng ý phụ huynh</InputLabel>
                            <Select
                              value={filters.parentConsent}
                              label="Đồng ý phụ huynh"
                              onChange={(e) =>
                                handleFilterChange(
                                  "parentConsent",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="">Tất cả</MenuItem>
                              <MenuItem value="pending">Chờ xử lý</MenuItem>
                              <MenuItem value="approved">Đã đồng ý</MenuItem>
                              <MenuItem value="denied">Từ chối</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          sx={{ width: "300px" }}
                        >
                          <FormControl fullWidth size="small">
                            <InputLabel>Trạng thái tiêm</InputLabel>
                            <Select
                              value={filters.vaccinationStatus}
                              label="Trạng thái tiêm"
                              onChange={(e) =>
                                handleFilterChange(
                                  "vaccinationStatus",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="">Tất cả</MenuItem>
                              <MenuItem value="scheduled">Đã lên lịch</MenuItem>
                              <MenuItem value="completed">Đã tiêm</MenuItem>
                              <MenuItem value="missed">Bỏ lỡ</MenuItem>
                              <MenuItem value="cancelled">Đã hủy</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Button
                            variant="text"
                            size="small"
                            onClick={handleClearFilters}
                            disabled={!hasActiveFilters}
                            fullWidth
                          >
                            Xóa bộ lọc
                          </Button>
                        </Grid>
                      </Grid>
                    </Card>
                  </Collapse>
                </Box>

                {/* Participants Table */}
                {participationsLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ mb: 2, width: "100%" }}
                    >
                      <Table sx={{ width: "100%" }}>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "grey.50" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Học sinh
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Đồng ý PH
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Trạng thái tiêm
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Ngày tiêm
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Ghi chú
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedParticipations.length > 0 ? (
                            paginatedParticipations.map(
                              (participant, index) => {
                                const studentInfo = participant.student;
                                return (
                                  <TableRow
                                    key={participant._id || index}
                                    hover
                                  >
                                    <TableCell>
                                      <Box>
                                        <Typography
                                          variant="subtitle2"
                                          sx={{ fontWeight: "medium" }}
                                        >
                                          {studentInfo?.name || "N/A"}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          Mã HS:{" "}
                                          {studentInfo?.studentCode || "N/A"}
                                        </Typography>
                                      </Box>
                                    </TableCell>

                                    <TableCell>
                                      <Chip
                                        label={
                                          participant.parentConsent ===
                                          "approved"
                                            ? "Đã đồng ý"
                                            : participant.parentConsent ===
                                              "pending"
                                            ? "Chờ phản hồi"
                                            : participant.parentConsent ===
                                              "denied"
                                            ? "Từ chối"
                                            : "Chưa rõ"
                                        }
                                        color={
                                          participant.parentConsent ===
                                          "approved"
                                            ? "success"
                                            : participant.parentConsent ===
                                              "pending"
                                            ? "warning"
                                            : participant.parentConsent ===
                                              "denied"
                                            ? "error"
                                            : "default"
                                        }
                                        size="small"
                                      />
                                    </TableCell>

                                    <TableCell>
                                      <Chip
                                        label={
                                          participant.vaccinationStatus ===
                                          "completed"
                                            ? "Đã tiêm"
                                            : participant.vaccinationStatus ===
                                              "scheduled"
                                            ? "Đã lên lịch"
                                            : participant.vaccinationStatus ===
                                              "missed"
                                            ? "Bỏ lỡ"
                                            : participant.vaccinationStatus ===
                                              "cancelled"
                                            ? "Đã hủy"
                                            : participant.vaccinationStatus ||
                                              "Chưa rõ"
                                        }
                                        color={
                                          participant.vaccinationStatus ===
                                          "completed"
                                            ? "success"
                                            : participant.vaccinationStatus ===
                                              "scheduled"
                                            ? "info"
                                            : participant.vaccinationStatus ===
                                              "missed"
                                            ? "warning"
                                            : participant.vaccinationStatus ===
                                              "cancelled"
                                            ? "error"
                                            : "default"
                                        }
                                        size="small"
                                      />
                                    </TableCell>

                                    <TableCell>
                                      <Typography variant="body2">
                                        {participant.vaccinationDate
                                          ? formatDate(
                                              participant.vaccinationDate
                                            )
                                          : "Chưa tiêm"}
                                      </Typography>
                                    </TableCell>

                                    <TableCell>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        {participant.notes || "Không có"}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            )
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                align="center"
                                sx={{ py: 4 }}
                              >
                                <Typography color="text.secondary" variant="h6">
                                  {searchTerm || hasActiveFilters
                                    ? "Không tìm thấy kết quả phù hợp"
                                    : "Chưa có người tham gia"}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 3,
                        }}
                      >
                        <Pagination
                          count={totalPages}
                          page={participationPage}
                          onChange={handleParticipationPageChange}
                          color="primary"
                          showFirstButton
                          showLastButton
                        />
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DetailView;
