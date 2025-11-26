import { useCart } from "../contexts/CartContext.jsx";
import DeliveryPopup from "../components/DeliveryPopup.jsx";

const CartPage = () => {
  const {
    cart,
    subtotal,
    comboDiscount,
    deliveryFee,
    total,
    removeFromCart,
    updateQty,
  } = useCart();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-6 text-(--accent)">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-xl">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div
                key={item._id}
                className="
                  flex gap-4 p-3 rounded-md
                  bg-(--deep) border border-(--accent-dark)
                "
              >
                <img
                  src={item.images?.[0]?.url}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h2 className="text-lg text-(--light)">{item.title}</h2>
                  <p className="text-(--accent)">${item.price}</p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        updateQty(item._id, Math.max(1, item.qty - 1))
                      }
                      className="px-3 py-1 bg-(--accent) text-(--deep) rounded"
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="px-3 py-1 bg-(--accent) text-(--deep) rounded"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="mt-3 text-sm text-red-400 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <DeliveryPopup />

          <div
            className="
              p-4 bg-(--deep) rounded-md border border-(--accent-dark)
              mt-6 space-y-2
            "
          >
            <p>
              Subtotal: <span className="text-(--accent)">${subtotal}</span>
            </p>

            <p>
              Combo Discount:
              <span className="text-(--accent)">
                {" "}
                -${comboDiscount.toFixed(2)}
              </span>
            </p>

            <p>
              Delivery Fee:
              <span className="text-(--accent)"> +${deliveryFee}</span>
            </p>

            <h2 className="text-2xl mt-3 text-(--accent)">Total: ${total}</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
