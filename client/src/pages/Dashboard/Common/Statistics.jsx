import { Helmet } from "react-helmet-async";
import useRole from "../../../hooks/useRole";
import AdminStatistics from "../../../components/Dashboard/Statistics/AdminStatistics";
import GuestStatistics from "../../../components/Dashboard/Statistics/GuestStatistics";
import HostStatistics from "../../../components/Dashboard/Statistics/HostStatistics";

const Statistics = () => {
  const [, role] = useRole();

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {role === "admin" && <AdminStatistics />}
      {role === "guest" && <GuestStatistics />}
      {role === "host" && (
        <div>
          <h2 className="text-xl text-center mt-4 font-semibold">
            My Host Statistics
          </h2>
          <HostStatistics />
          <hr />
          <h2 className="text-xl text-center my-4 font-semibold">
            My Guest Statistics
          </h2>
          <GuestStatistics />
        </div>
      )}
    </div>
  );
};

export default Statistics;
