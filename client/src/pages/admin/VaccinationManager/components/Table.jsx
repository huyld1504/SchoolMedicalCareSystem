import React from "react";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TablePagination,
  CircularProgress,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import vaccinationApi from "../../../../api/vaccinationApi";
import { useNavigate } from "react-router";
import useQueryParams, {
  createQueryParams,
} from "../../../../hooks/query/useQueryParams";
import { useDispatch } from "react-redux";
import {
  setIsOpen,
  setVaccination,
  setPreviewCampaignId,
  setIsPreviewOpen,
} from "../../../../store/managerVaccinationSlice";
import { unpackExcelStudentIds } from "../../../../utils/unpackExcelStudentIds";
import CampaignPreviewDialog from "./CampaignPreviewDialog";

const statusMap = {
  planned: "Kế hoạch",
  ongoing: "Đang diễn ra",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
}

const Table = () => {
  const params = useQueryParams();
  const { data, isLoading } = useQuery({
    queryKey: ["vaccinations", params],
    queryFn: () => vaccinationApi.getVaccinations(params),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vaccinationCampaigns = data?.data?.records || [];
  const total = data?.data?.total || 0;
  const page = data?.data?.page || 0;
  const totalPages = data?.data?.totalPages || 0;
  const limit = data?.data?.limit || 0;

  const handleChangePage = (event, newPage) => {
    const newQuery = createQueryParams({
      ...params,
      page: newPage,
    });
    navigate({ search: newQuery });
  };

  const handleChangeRowsPerPage = (event) => {
    const newQuery = createQueryParams({
      ...params,
      limit: event.target.value,
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

  return (
    <TableContainer component={Paper}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6">Danh sách đợt tiêm chủng</Typography>
      </Box>
      <MuiTable>
        <TableHead>
          <TableRow>
            <TableCell>Tên vắc xin</TableCell>
            <TableCell>Loại vắc xin</TableCell>
            <TableCell>Đối tượng tiêm</TableCell>
            <TableCell>Ngày bắt đầu</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : vaccinationCampaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography>Không có dữ liệu</Typography>
              </TableCell>
            </TableRow>
          ) : (
            vaccinationCampaigns.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.vaccineName}</TableCell>
                <TableCell>{row.vaccineType}</TableCell>
                <TableCell>{row.targetAudience}</TableCell>
                <TableCell>{formatDate(row.startDate)}</TableCell>
                <TableCell>{statusMap[row.status] || row.status}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => {
                      navigate(`${row._id}`);
                    }}
                  >
                    Xem
                  </Button>
                  <Button
                    size="small"
                    onClick={async () => {
                      await Promise.all([
                        dispatch(setVaccination(row)),
                        dispatch(setIsOpen(true)),
                      ]);
                    }}
                  >
                    Sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        <TablePagination
          count={total}
          page={page}
          rowsPerPage={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </MuiTable>
      <CampaignPreviewDialog />
    </TableContainer>
  );
};

export default Table;
