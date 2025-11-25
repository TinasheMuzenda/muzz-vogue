import Stripe from "stripe";
import Order from "../../models/Order.jsx";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return res.status(400).send("Webhook error");
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const id = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(id, { paymentStatus: "paid" });
  }

  res.sendStatus(200);
};
