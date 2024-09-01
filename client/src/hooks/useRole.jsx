import useAuth from "./useAuth";
import { getRole } from "../api/auth";
import { useQuery } from "@tanstack/react-query";

const useRole = () => {
  const { user, loading } = useAuth();

  const { data: userProfile, isLoading } = useQuery({
    enabled: !loading && !!user?.email,
    queryFn: async () => await getRole(user?.email),
    queryKey: ["role"],
  });

  // Destructure `role` from `userProfile`
  const role = userProfile?.role || "";

  return [userProfile, role, isLoading];
};

export default useRole;
