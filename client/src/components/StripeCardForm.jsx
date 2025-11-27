import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CardForm({ onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmCardPayment(
      elements.getElement(CardElement)
    );

    if (result.error) {
      onError(result.error);
    } else {
      onSuccess(result.paymentIntent);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-(--deep) p-4 rounded">
      <CardElement className="p-3 bg-white text-black rounded" />
      <button
        disabled={!stripe || loading}
        className="px-4 py-2 bg-(--accent) text-(--deep) rounded"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}
