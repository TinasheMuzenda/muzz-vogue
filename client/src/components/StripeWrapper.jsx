import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CardForm from "./StripeCardForm.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function StripeWrapper({ clientSecret, onSuccess, onError }) {
  const options = { clientSecret };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CardForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
