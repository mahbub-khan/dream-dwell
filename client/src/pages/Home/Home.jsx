import { Helmet } from "react-helmet-async";
import Categories from "../../components/Categories/Categories";
import Rooms from "../../components/Rooms/Rooms";
import useAuth from "../../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      <Helmet>
        <title>DreamDwell | Vacation Homes & Condo Rentals</title>
      </Helmet>
      {/* Categories section */}
      <Categories />
      {/* Rooms section */}
      <Rooms />
    </div>
  );
};

export default Home;
