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
    error: rolesError,
  } = useQueryRoles();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) => userApi.createUser(data),
    onSuccess: (res) => {
      setForm(initialState);
      if (onSuccess) {
        onSuccess();
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (err) => {
      setError(
        err?.response?.data?.message || "Failed to create account. Try again."
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
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Invalid email";
    if (!form.password.trim() || form.password.length < 6)
      return "Password must be at least 6 characters";
    if (!form.roleId) return "Role is required";
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
        Create New Account
      </Typography>
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          label="Name"
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
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select
            name="roleId"
            value={form.roleId}
            label="Role"
            onChange={handleChange}
            disabled={loadingRoles}
          >
            <MenuItem value="">Select Role</MenuItem>
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
            "Create Account"
          )}
        </Button>
      </form>
    </Paper>
  );
};

export default CreateAccountForm;
