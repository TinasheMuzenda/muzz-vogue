import { useState } from "react";
import { useCart } from "../contexts/CartContext.jsx";

const DeliveryPopup = () => {
  const { deliveryMethod, setDeliveryMethod } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          mb-4 px-4 py-2 rounded bg-(--accent) 
          text-(--deep) font-semibold
        "
      >
        Choose Delivery Method
      </button>

      {open && (
        <div
          className="
            fixed inset-0 flex items-center justify-center
            bg-black/40 backdrop-blur-sm
          "
        >
          <div
            className="
              p-6 rounded-md bg-(--deep)
              border border-(--accent-dark)
              w-80
            "
          >
            <h2 className="text-xl mb-4 text-(--accent)">Delivery Method</h2>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setDeliveryMethod("collect");
                  setOpen(false);
                }}
                className={`
                  px-4 py-2 rounded 
                  ${
                    deliveryMethod === "collect"
                      ? "bg-(--accent) text-(--deep)"
                      : "bg-(--bg) text-(--light) border border-(--accent-dark)"
                  }
                `}
              >
                Collect (Free)
              </button>

              <button
                onClick={() => {
                  setDeliveryMethod("deliver");
                  setOpen(false);
                }}
                className={`
                  px-4 py-2 rounded 
                  ${
                    deliveryMethod === "deliver"
                      ? "bg-(--accent) text-(--deep)"
                      : "bg-(--bg) text-(--light) border border-(--accent-dark)"
                  }
                `}
              >
                Deliver (5% over $150 or $9)
              </button>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full px-4 py-2 bg-red-500 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryPopup;
