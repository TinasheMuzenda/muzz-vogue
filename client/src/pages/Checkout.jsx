import { useState, useNavigate } from "react";
import { useCart } from "../contexts/CartContext.jsx";
import api from "../services/api.jsx";
import {
  createStripeIntent,
  createPayPalOrder,
  capturePayPalOrder,
  processEcocash,
} from "../services/paymentService.jsx";
import StripeWrapper from "../components/StripeWrapper.jsx";

const LoadingOverlay = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="text-white text-lg font-semibold animate-pulse">
        Processing…
      </div>
    </div>
  );
};

const SuccessModal = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-(--deep) border border-(--accent-dark) p-6 rounded-lg shadow-xl w-[90%] max-w-sm text-center animate-scaleIn">
        <h2 className="text-xl text-(--accent) font-bold mb-3">
          Payment Successful 🎉
        </h2>
        <p className="text-(--text) mb-5">
          Thank you! Your order has been processed successfully.
        </p>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-(--accent) text-(--deep) rounded hover:opacity-80"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const StripeCheckoutButton = ({ orderPayload, onSuccess, onError }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  const startStripe = async () => {
    try {
      setLoading(true);
      const { data } = await createStripeIntent({
        orderId: orderPayload.orderId,
      });
      setClientSecret(data.clientSecret);
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  if (!clientSecret)
    return (
      <button
        onClick={startStripe}
        className="px-4 py-2 rounded bg-(--accent) text-(--deep)"
      >
        {loading ? "Loading…" : "Pay with Stripe"}
      </button>
    );

  return (
    <div className="my-3">
      <StripeWrapper
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  );
};

const PayPalButton = ({ orderPayload, onSuccess, onError }) => {
  const [loaded, setLoaded] = useState(false);

  const loadPayPal = () => {
    if (window.paypal) return setLoaded(true);
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${
      import.meta.env.VITE_PAYPAL_CLIENT_ID
    }&currency=USD`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  };

  const createOrder = async () => {
    const res = await createPayPalOrder({ orderId: orderPayload.orderId });
    return res.data.id;
  };

  const capture = async (paypalOrderId) => {
    return await capturePayPalOrder({
      paypalOrderId,
      orderId: orderPayload.orderId,
    });
  };

  if (!loaded) loadPayPal();

  setTimeout(() => {
    if (!window.paypal || !document.getElementById("paypal-button-container"))
      return;
    window.paypal
      .Buttons({
        createOrder,
        onApprove: async (data, actions) => {
          const captureResult = await actions.order.capture();
          await capture(data.orderID);
          onSuccess(captureResult);
        },
        onError,
      })
      .render("#paypal-button-container");
  }, 300);

  return <div id="paypal-button-container" className="my-2"></div>;
};

const EcocashButton = ({ orderPayload, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleEcocash = async () => {
    try {
      setLoading(true);
      const res = await processEcocash({
        orderId: orderPayload.orderId,
        amount: orderPayload.total,
        phoneNumber: orderPayload.phoneNumber,
      });
      onSuccess(res.data);
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEcocash}
      className="px-4 py-2 rounded bg-(--accent) text-(--deep)"
    >
      {loading ? "Initiating…" : "Pay with Ecocash"}
    </button>
  );
};

export default function Checkout() {
  const { cart, subtotal, comboDiscount, deliveryFee, total, deliveryMethod } =
    useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderPayload, setOrderPayload] = useState(null);
  const [message, setMessage] = useState("");

  const prepareOrder = async () => {
    setLoading(true);
    try {
      const res = await api.post("/orders", {
        items: cart.map((i) => ({
          productId: i._id,
          qty: i.qty,
          price: i.price,
        })),
        subtotal,
        deliveryMethod,
        deliveryFee,
        total,
        paymentMethod,
        address,
      });
      setOrderPayload({ orderId: res.data._id, total: res.data.total });
      setMessage("Order created. Proceed to payment.");
    } catch (err) {
      setMessage(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSuccess = async (info) => {
    setLoading(true);
    try {
      await api.post(`/orders/${orderPayload.orderId}/confirm`, {
        paymentInfo: info,
      });
      setMessage("Payment successful");
      navigate(`/order/${orderPayload.orderId}`);
    } catch (_) {}
    setLoading(false);
  };

  const onPaymentError = (err) => {
    setMessage("Payment error: " + (err?.message || JSON.stringify(err)));
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <SuccessModal
        visible={successModal}
        onClose={() => setSuccessModal(false)}
      />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl mb-4 text-(--accent)">Checkout</h1>
        <div className="mb-4">
          <label className="block mb-1">Delivery Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 rounded bg-(--deep) border border-(--accent-dark)"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Phone (for Ecocash)</label>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 rounded bg-(--deep) border border-(--accent-dark)"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 rounded bg-(--deep) border border-(--accent-dark)"
          >
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
            <option value="ecocash">Ecocash</option>
          </select>
        </div>
        <div className="mb-6 p-4 rounded bg-(--deep) border border-(--accent-dark)">
          <p>
            Subtotal:{" "}
            <span className="text-(--accent)">${subtotal.toFixed(2)}</span>
          </p>
          <p>
            Combo discount:{" "}
            <span className="text-(--accent)">
              -${comboDiscount.toFixed(2)}
            </span>
          </p>
          <p>
            Delivery fee:{" "}
            <span className="text-(--accent)">${deliveryFee}</span>
          </p>
          <h2 className="text-xl mt-2 text-(--accent)">
            Total: ${total.toFixed(2)}
          </h2>
        </div>
        {!orderPayload ? (
          <button
            onClick={prepareOrder}
            className="px-4 py-2 rounded bg-(--accent) text-(--deep)"
          >
            {loading ? "Creating order..." : "Create Order"}
          </button>
        ) : (
          <div className="space-y-4">
            {paymentMethod === "paypal" && (
              <PayPalButton
                orderPayload={orderPayload}
                onSuccess={onPaymentSuccess}
                onError={onPaymentError}
              />
            )}
            {paymentMethod === "stripe" && (
              <StripeCheckoutButton
                orderPayload={orderPayload}
                onSuccess={onPaymentSuccess}
                onError={onPaymentError}
              />
            )}
            {paymentMethod === "ecocash" && (
              <EcocashButton
                orderPayload={{
                  orderId: orderPayload.orderId,
                  total: orderPayload.total,
                  phoneNumber,
                }}
                onSuccess={onPaymentSuccess}
                onError={onPaymentError}
              />
            )}
          </div>
        )}
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </>
  );
}
