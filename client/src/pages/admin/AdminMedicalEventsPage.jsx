import React, { useState, useEffect } from "react";
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Grid, FormControl, Select, MenuItem, InputLabel, TextField, InputAdornment, Pagination, Tooltip, IconButton, CircularProgress, Alert
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Visibility as ViewIcon, Search as SearchIcon, FilterList as FilterIcon } from "@mui/icons-material";
import { useNavigate } from "react-router";
import medicalEventApi from "../../api/medicalEventApi";

const AdminMedicalEventsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ type: '', level: '', status: '', keyword: '' });
  const [page, setPage] = useState(1);
  const [medicalEvents, setMedicalEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 10,
          keyword: filters.keyword,
          type: filters.type,
          level: filters.level,
          status: filters.status
        };
        const res = await medicalEventApi.getAll(params);
        if (res.isSuccess && res.data) {
          setMedicalEvents(res.data.records || []);
          setTotalPages(res.data.totalPages || 1);
        } else {
          setMedicalEvents([]);
          setTotalPages(1);
        }
      } catch (err) {
        setMedicalEvents([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, page]);

  const handleFilterChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value });
  };

  const handleSearchChange = (event) => {
    setFilters({ ...filters, keyword: event.target.value });
  };

  const handleApplyFilters = () => {
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ type: '', level: '', status: '', keyword: '' });
    setPage(1);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Quản lý Sự kiện Y tế</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("add")}>Tạo sự kiện mới</Button>
      </Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Loại sự kiện</InputLabel>
                <Select value={filters.type} label="Loại sự kiện" onChange={handleFilterChange('type')}>
                  <MenuItem value="">Tất cả loại</MenuItem>
                  <MenuItem value="cấp cứu">Cấp cứu</MenuItem>
                  <MenuItem value="chấn thương">Chấn thương</MenuItem>
                  <MenuItem value="bệnh">Bệnh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Mức độ</InputLabel>
                <Select value={filters.level} label="Mức độ" onChange={handleFilterChange('level')}>
                  <MenuItem value="">Tất cả mức độ</MenuItem>
                  <MenuItem value="3">Khẩn cấp</MenuItem>
                  <MenuItem value="2">Trung bình</MenuItem>
                  <MenuItem value="1">Nhẹ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select value={filters.status} label="Trạng thái" onChange={handleFilterChange('status')}>
                  <MenuItem value="">Tất cả trạng thái</MenuItem>
                  <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
                  <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
                  <MenuItem value="Chờ xử lí">Chờ xử lí</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Tìm kiếm"
                value={filters.keyword}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button variant="contained" onClick={handleApplyFilters} color="primary" startIcon={<SearchIcon />}>Tìm kiếm</Button>
                <Button variant="outlined" onClick={handleClearFilters} color="secondary" startIcon={<FilterIcon />}>Xóa bộ lọc</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : medicalEvents.length === 0 ? (
        <Alert severity="info">Không có sự kiện y tế nào.</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">STT</TableCell>
                  <TableCell align="center">Tên sự kiện</TableCell>
                  <TableCell align="center">Ngày tổ chức</TableCell>
                  <TableCell align="center">Loại sự kiện</TableCell>
                  <TableCell align="center">Mức độ</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalEvents.map((row, idx) => (
                  <TableRow key={row._id || row.id} hover>
                    <TableCell align="center">{(page - 1) * 10 + idx + 1}</TableCell>
                    <TableCell align="center">{row.name || row.title}</TableCell>
                    <TableCell align="center">{row.date || row.dateHappened || row.createdAt}</TableCell>
                    <TableCell align="center">{row.type}</TableCell>
                    <TableCell align="center">{row.level === 3 ? 'Khẩn cấp' : row.level === 2 ? 'Trung bình' : row.level === 1 ? 'Nhẹ' : ''}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton color="info" size="small" onClick={() => navigate(`${row._id || row.id}`)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton color="primary" size="small" onClick={() => navigate(`${row._id || row.id}/edit`)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} showFirstButton showLastButton />
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminMedicalEventsPage;
