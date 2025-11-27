import Wishlist from "../models/Wishlist.jsx";

// export const getWishlist = async (req, res) => {
//   const { userId } = req.params;
//   let wishlist = await Wishlist.findOne({ userId });

//   if (!wishlist) {
//     wishlist = await Wishlist.create({ userId, items: [] });
//   }

//   res.json(wishlist);
// };

// export const addToWishlist = async (req, res) => {
//   const { userId } = req.params;
//   const { productId } = req.body;

//   const wishlist = await Wishlist.findOneAndUpdate(
//     { userId },
//     { $addToSet: { items: { productId } } },
//     { new: true, upsert: true }
//   );

//   res.json(wishlist);
// };

// export const removeFromWishlist = async (req, res) => {
//   const { userId } = req.params;
//   const { productId } = req.body;

//   const wishlist = await Wishlist.findOneAndUpdate(
//     { userId },
//     { $pull: { items: { productId } } },
//     { new: true }
//   );

//   res.json(wishlist);
// };

export const getWishlist = async (req, res) => {
  const { userId } = req.params;
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, items: [] });
  }
  res.json(wishlist);
};

export const addToWishlist = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $addToSet: { items: { productId } } },
    { new: true, upsert: true }
  );
  res.json(wishlist);
};

export const removeFromWishlist = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $pull: { items: { productId } } },
    { new: true }
  );
  res.json(wishlist);
};
