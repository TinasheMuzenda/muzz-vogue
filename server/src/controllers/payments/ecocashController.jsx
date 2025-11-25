import Paynow from "paynow";

export const payWithEcocash = async (req, res) => {
  try {
    const { amount, email, phoneNumber } = req.body;

    if (!amount || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Amount and phone number required" });
    }

    // Create Paynow instance
    const paynow = new Paynow(
      process.env.PAYNOW_INTEGRATION_ID,
      process.env.PAYNOW_INTEGRATION_KEY
    );

    // Set result return URLs (important!)
    paynow.resultUrl = process.env.PAYNOW_RESULT_URL; // e.g. https://yourapp.com/api/payments/paynow/result
    paynow.returnUrl = process.env.PAYNOW_RETURN_URL; // e.g. https://yourapp.com/payment-success

    // Create the payment
    const payment = paynow.createPayment(
      email ?? "customer@example.com",
      email
    );

    payment.add("EcoCash Payment", amount);

    // Send payment to Paynow
    const response = await paynow.sendMobile(payment, phoneNumber, "ecocash");

    if (response.success) {
      return res.json({
        message: "Payment initiated successfully",
        pollUrl: response.pollUrl,
        instructions:
          "Tell user to approve the payment on their EcoCash phone.",
        status: "awaiting_confirmation",
      });
    } else {
      return res.status(400).json({
        message: "Payment failed",
        error: response.error,
      });
    }
  } catch (err) {
    console.error("EcoCash error: ", err);
    res
      .status(500)
      .json({ message: "Payment initiation error", error: err.message });
  }
};
