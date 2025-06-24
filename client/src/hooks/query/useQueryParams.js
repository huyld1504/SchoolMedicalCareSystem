import { useLocation } from "react-router";

export default function useQueryParams() {
  const location = useLocation();
  const params = {};

  // Parse query string from location.search
  const searchParams = new URLSearchParams(location.search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

// Alternative hook that doesn't depend on react-router
export function useQueryParamsSimple() {
  const params = {};
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export function createQueryParams(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
