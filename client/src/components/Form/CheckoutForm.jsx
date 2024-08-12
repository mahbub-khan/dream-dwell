import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import "./CheckoutForm.css";

const CheckoutForm = ({ bookingInfo, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

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
  };

  return (
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
  );
};

export default CheckoutForm;
