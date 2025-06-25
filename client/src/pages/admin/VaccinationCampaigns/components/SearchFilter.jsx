import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import useQueryParams, {
  createQueryParams,
} from "../../../../hooks/query/useQueryParams";
import { useNavigate } from "react-router";

const SearchFilter = () => {
  const params = useQueryParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(params.keyword || "");

  const handleSearch = () => {
    const newQuery = createQueryParams({
      ...params,
      keyword: searchValue,
      page: 1, // Reset to first page when searching
    });
    navigate({ search: newQuery });
  };

  const handleClear = () => {
    setSearchValue("");
    const { keyword, ...otherParams } = params;
    const newQuery = createQueryParams({
      ...otherParams,
      page: 1,
    });
    navigate({ search: newQuery });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <TextField
      placeholder="Tìm kiếm chiến dịch..."
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyPress={handleKeyPress}
      sx={{ minWidth: 300 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: searchValue && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchFilter;
