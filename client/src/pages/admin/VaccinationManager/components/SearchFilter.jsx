
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
    <div>
      <TextField
        placeholder="Search users by name or email..."
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
              <IconButton size="small" onClick={handleClearSearch}>
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
            page: 1, // Reset to first page when searching
          });
          navigate({ search: newQuery });
        }}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchFilter;