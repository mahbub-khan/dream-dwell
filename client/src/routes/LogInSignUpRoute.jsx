import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LogInSignUpRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return children;
  }

  return <Navigate to="/"></Navigate>;
};

export default LogInSignUpRoute;
