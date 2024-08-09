/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import Loader from "../components/Shared/Loader";
import useRole from "../hooks/useRole";

const HostRoute = ({ children }) => {
  const [role, loading] = useRole(); //loading is for role, not the same as loading in useAuth which is for user

  if (loading) return <Loader />;
  if (role === "host") return children;

  return <Navigate to="/dashboard" />;
};

export default HostRoute;
