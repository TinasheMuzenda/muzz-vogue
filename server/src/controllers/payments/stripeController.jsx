import Stripe from "stripe";
import Order from "../../models/Order.jsx";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createStripeIntent = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100),
    currency: "usd",
  });

  res.json({ clientSecret: paymentIntent.client_secret });
};
