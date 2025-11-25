export function calculateDelivery(subtotal, method) {
  if (method === "collect") return 0;

  if (subtotal > 150) return subtotal * 0.05;

  return 9;
}
