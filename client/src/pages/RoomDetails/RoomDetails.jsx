import Container from "../../components/Shared/Container";
import { useLoaderData } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../../components/RoomDetails/Header/Header";
import RoomInfo from "../../components/RoomDetails/RoomInfo/RoomInfo";
import RoomReservation from "../../components/RoomDetails/RoomReservation/RoomReservation";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Shared/Loader";

const RoomDetails = () => {
  const room = useLoaderData();
  // const { loading } = useAuth();

  // if (loading) return <Loader />;

  return (
    <Container>
      <Helmet>
        <title>{room?.title}</title>
      </Helmet>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <Header room={room} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 mt-8 gap-8">
          <RoomInfo room={room} />
          {/* Room Reservation */}
          <div className="mb-10 order-first md:order-last md:col-span-4 lg:col-span-3 col-auto">
            <RoomReservation room={room} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RoomDetails;
