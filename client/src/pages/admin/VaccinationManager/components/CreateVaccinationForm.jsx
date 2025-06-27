
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Alert,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import vaccinationApi from  "../../../../api/vaccinationApi";
import { useDispatch, useSelector } from "react-redux";
import { da } from "date-fns/locale";

const initialState = {
  id: "",
  vaccineName: "",
  vaccineType: "",
  targetAudience: "",
  startDate: "",
  status: "",
};

const statusOptions = [
  { value: "planned", label: "Kế hoạch" },
  { value: "ongoing", label: "Đang diễn ra" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const CreateVaccinationForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) => {
      if (vaccination) {
        const newData = {
          vaccineName: data.vaccineName,
          vaccineType: data.vaccineType,
          targetAudience: data.targetAudience,
          startDate: data.startDate,
          status: data.status,
        };
        return vaccinationApi.updateVaccination(data._id, newData);
      }
      const newData = {
        vaccineName: data.vaccineName,
        vaccineType: data.vaccineType,
        targetAudience: data.targetAudience,
        startDate: data.startDate,
      };
      return vaccinationApi.createVaccination(newData);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (err) => {
      setError(err?.response?.data?.message || "Failed to create vaccination");
    },
  });
  const validateCreateVaccination = () => {
    if (!form.vaccineName.trim()) return "Tên vắc xin là bắt buộc";
    if (!form.vaccineType.trim()) return "Loại vắc xin là bắt buộc";
    if (!form.targetAudience.trim()) return "Đối tượng tiêm là bắt buộc";
    if (!form.startDate.trim()) return "Ngày bắt đầu là bắt buộc";
    return "";
  };

  const dispatch = useDispatch();
  const { vaccination } = useSelector((state) => state.managerVaccination);

  useEffect(() => {
    if (vaccination) {
      setForm(vaccination);
    }
  }, [vaccination]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateCreateVaccination();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    mutation.mutate(form);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", p: 2 }}
    >
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Tên vắc xin"
          value={form.vaccineName}
          onChange={(e) => handleChange("vaccineName", e.target.value)}
          fullWidth
        />
        <TextField
          label="Loại vắc xin"
          value={form.vaccineType}
          onChange={(e) => handleChange("vaccineType", e.target.value)}
          fullWidth
        />
        <TextField
          label="Đối tượng tiêm"
          value={form.targetAudience}
          onChange={(e) => handleChange("targetAudience", e.target.value)}
          fullWidth
        />
        <TextField
          label="Ngày bắt đầu"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
          fullWidth
        />
        {vaccination && (
          <FormControl fullWidth>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              value={form.status}
              label="Trạng thái"
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? (
            <CircularProgress size={24} />
          ) : vaccination ? (
            "Cập nhật"
          ) : (
            "Tạo mới"
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateVaccinationForm;