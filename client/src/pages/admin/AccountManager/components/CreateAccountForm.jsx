import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import userApi from "../../../../api/userApi";
import { useQueryRoles } from "../../../../hooks/query/queryRole";

const initialState = {
  name: "",
  email: "",
  password: "",
  roleId: "",
};

const CreateAccountForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const {
    data: roles,
    isLoading: loadingRoles,
  } = useQueryRoles();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) => userApi.createUser(data),
    onSuccess: () => {
      setForm(initialState);
      if (onSuccess) {
        onSuccess();
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (err) => {
      setError(
        err?.response?.data?.message || "Tạo tài khoản thất bại. Vui lòng thử lại."
      );
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Vui lòng nhập họ tên";
    if (!form.email.trim()) return "Vui lòng nhập email";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      return "Email không hợp lệ";
    if (!form.password.trim() || form.password.length < 6)
      return "Mật khẩu phải có ít nhất 6 ký tự";
    if (!form.roleId) return "Vui lòng chọn vai trò";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    mutation.mutate(form);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tạo tài khoản mới
      </Typography>
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          label="Họ tên"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mật khẩu"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Vai trò</InputLabel>
          <Select
            name="roleId"
            value={form.roleId}
            label="Vai trò"
            onChange={handleChange}
            disabled={loadingRoles}
          >
            <MenuItem value="">Chọn vai trò</MenuItem>
            {roles?.data?.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(error || mutation.isError) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || mutation.error?.message}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? (
            <CircularProgress size={24} />
          ) : (
            "Tạo tài khoản"
          )}
        </Button>
      </form>
    </Paper>
  );
};

export default CreateAccountForm;
