import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import "./CheckoutForm.css";
import toast from "react-hot-toast";
import {
  createPaymentIntent,
  saveBookingInfo,
  updateStatus,
} from "../../api/bookings";
import { useNavigate } from "react-router-dom";
import {
  generateDateArray,
  isAllDatesBooked,
} from "../RoomDetails/Utilities/RoomReservationUtilies";

const CheckoutForm = ({
  bookingInfo,
  closeModal,
  room,
  bookedDates,
  setBookedDates,
  latestAvailableDate,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  //Create Payment intent
  useEffect(() => {
    if (bookingInfo.price > 0) {
      createPaymentIntent({ price: bookingInfo.price }).then((data) => {
        console.log(data.clientSecret);
        setClientSecret(data.clientSecret);
      });
    }
  }, [bookingInfo]);

  console.log(bookingInfo);

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    //Card data lookup (Asynchronus Network Call)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setCardError(error.message);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setCardError("");
    }

    setProcessing(true);

    //Money will be deducted here (Asynchronus network call)
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email,
            name: user?.displayName,
          },
        },
      });

    if (confirmError) {
      console.log(confirmError);
      setCardError(confirmError.message);
    }

    console.log("Payment Intent", paymentIntent);

    if (paymentIntent.status === "succeeded") {
      const paymentInfo = {
        ...bookingInfo,
        transactionId: paymentIntent.id,
        date: new Date(),
      };

      try {
        //Save payment information to the server
        await saveBookingInfo(paymentInfo);

        // Add new dates to bookedDates
        const newBookedDates = generateDateArray(
          bookingInfo?.from,
          bookingInfo?.to
        );

        setBookedDates((prevDates) => {
          const updatedDates = [...prevDates, ...newBookedDates];
          console.log(updatedDates);

          const isRoomBooked = isAllDatesBooked(
            updatedDates,
            latestAvailableDate,
            room
          );
          console.log(isRoomBooked);

          if (isRoomBooked) {
            //Update room status in DB if all dates are not booked
            updateStatus(bookingInfo?.roomId, true);
          }

          return updatedDates;
        });

        const text = `Booking Successful for ${bookingInfo.title}`;
        navigate("/dashboard/my-bookings");
        toast.success(text);
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      } finally {
        setProcessing(false);
      }

      setProcessing(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="my-2">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <div className="flex mt-2 justify-around">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || !clientSecret || processing}
            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            {processing ? (
              <ImSpinner9 className="m-auto animate-spin" size={24} />
            ) : (
              `Pay ${bookingInfo.price} €`
            )}
          </button>
        </div>
      </form>
      {cardError && <p className="text-red-600 ml-8">{cardError}</p>}
    </>
  );
};

export default CheckoutForm;
