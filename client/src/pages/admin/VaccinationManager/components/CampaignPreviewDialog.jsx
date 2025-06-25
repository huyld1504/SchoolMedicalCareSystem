import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import vaccinationApi from "../../../../api/vaccinationApi";
import { setIsPreviewOpen } from "../../../../store/managerVaccinationSlice";
import { unpackExcelStudentIds } from "../../../../utils/unpackExcelStudentIds";

const parentConsentMap = {
  pending: "Chờ phụ huynh xác nhận",
  approved: "Đồng ý",
  rejected: "Từ chối",
};
const vaccinationStatusMap = {
  scheduled: "Đã lên lịch",
  completed: "Đã tiêm",
  absent: "Vắng mặt",
};

const CampaignPreviewDialog = () => {
  const dispatch = useDispatch();
  const { previewCampaignId, isPreviewOpen } = useSelector(
    (state) => state.managerVaccination
  );
  const [importing, setImporting] = React.useState(false);
  const [importMsg, setImportMsg] = React.useState("");
  const fileInputRef = React.useRef();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["participations", previewCampaignId],
    queryFn: () =>
      previewCampaignId
        ? vaccinationApi.getVaccinationPartticipations(previewCampaignId)
        : Promise.resolve({ data: { records: [] } }),
    enabled: !!previewCampaignId && isPreviewOpen,
  });

  const participations = data?.data?.records || [];

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
      await vaccinationApi.addStudentToVaccination(previewCampaignId, data);
      setImportMsg("Import thành công!");
      refetch();
    } catch (err) {
      setImportMsg("Import thất bại: " + err.response.data.message);
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  return (
    <Dialog
      open={isPreviewOpen}
      onClose={() => dispatch(setIsPreviewOpen(false))}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Danh sách học sinh tham gia đợt tiêm chủng</DialogTitle>
      <DialogContent>
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
                importMsg.includes("thành công") ? "success.main" : "error.main"
              }
              sx={{ ml: 2 }}
            >
              {importMsg}
            </Typography>
          )}
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : participations.length === 0 ? (
          <Typography>Không có dữ liệu</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên học sinh</TableCell>
                <TableCell>Mã số sinh viên</TableCell>
                <TableCell>Mã BHYT</TableCell>
                <TableCell>Phụ huynh xác nhận</TableCell>
                <TableCell>Trạng thái tiêm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participations.map((row) => {
                // Nếu backend trả về student là object
                const student =
                  typeof row.student === "object" && row.student !== null
                    ? row.student
                    : {};
                return (
                  <TableRow key={row._id}>
                    <TableCell>{student._id || row.student}</TableCell>
                    <TableCell>{student.name || "-"}</TableCell>
                    <TableCell>{student.studentCode || "-"}</TableCell>
                    <TableCell>{student.healthInsuranceCode || "-"}</TableCell>
                    <TableCell>
                      {parentConsentMap[row.parentConsent] || row.parentConsent}
                    </TableCell>
                    <TableCell>
                      {vaccinationStatusMap[row.vaccinationStatus] ||
                        row.vaccinationStatus}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(setIsPreviewOpen(false))}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampaignPreviewDialog;
