export const formatPrice = (num) => {
  try {
    return `$${Number(num).toFixed(2)}`;
  } catch {
    return "$0.00";
  }
};

export const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

export const shortId = (id) => {
  if (!id) return "";
  return "#" + id.slice(-6).toUpperCase();
};
