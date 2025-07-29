import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import useQueryParams, {
  createQueryParams,
} from "../../../../hooks/query/useQueryParams";
import { useNavigate } from "react-router";

const SearchFilter = () => {
  const params = useQueryParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(params.search || "");

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    const newQuery = createQueryParams({
      ...params,
      search: undefined,
      page: 1,
    });
    navigate({ search: newQuery });
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <TextField
        placeholder="Tìm người dùng theo tên hoặc loại..."
        value={searchValue}
        onChange={handleSearch}
        size="small"
        sx={{ minWidth: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchValue && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClearSearch}
                aria-label="Xóa tìm kiếm"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          const newQuery = createQueryParams({
            ...params,
            keyword: searchValue || undefined,
            page: 1, // Trở về trang đầu khi tìm kiếm
          });
          navigate({ search: newQuery });
        }}
      >
        Tìm kiếm
      </Button>
    </div>
  );
};

export default SearchFilter;
