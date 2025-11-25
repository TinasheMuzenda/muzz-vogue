import paypal from "@paypal/checkout-server-sdk";
import Order from "../../models/Order.jsx";

const env = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT,
  process.env.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(env);

export const createPayPalOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          value: order.total.toFixed(2),
          currency_code: "USD",
        },
      },
    ],
  });

  const response = await client.execute(request);
  res.json({ id: response.result.id });
};

export const capturePayPalOrder = async (req, res) => {
  const { paypalOrderId, orderId } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
  request.requestBody({});

  const capture = await client.execute(request);

  await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid" });

  res.json(capture.result);
};
