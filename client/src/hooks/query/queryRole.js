import roleApi from "../../api/roleApi";
import { useQuery } from "@tanstack/react-query";
export const useQueryRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => roleApi.getRoles(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
