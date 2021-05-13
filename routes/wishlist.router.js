const router = require("express").Router();
const User = require("../models/user.model");
const { Book } = require("../models/book.model");
const Wishlist = require("../models/wishlist.model");
const { createIndexes } = require("../models/user.model");

router.param("wishlistId", async (req, res, next, wishlistId) => {
  try {
    const wishlistFound = await Wishlist.findById(wishlistId).populate(
      "items.book"
    );
    if (!wishlistFound) {
      res.status(404).json({ success: false, message: "Wishlist not found!" });
    }
    req.wishlist = wishlistFound;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(+error.code)
      .json({ success: false, message: "Error while retrieving wishlist." });
  }
});

router
  .route("/:wishlistId")
  .get(async (req, res) => {
    try {
      res.status(200).json({ success: true, wishlist: req.wishlist });
    } catch (error) {
      console.error(error);
      res
        .status(+error.code)
        .json({ success: false, message: "Cart not found in database." });
    }
  })
  .post(async (req, res) => {
    const wishlist = req.wishlist;
    const { action, bookId, format } = req.body;
    try {
      switch (action) {
        case "ADD_TO_WISHLIST": {
          if (!wishlist.items.find((item) => item.book._id == bookId)) {
            const newWishlistItem = {
              book: bookId,
              format,
            };
            wishlist.items.push(newWishlistItem);
            const savedWishlist = await wishlist.save();
            if (!savedWishlist) {
              return res.status(500).json({
                success: false,
                message: "Error in adding product to wishlist.",
              });
            }
            const updatedWishlist = await Wishlist.findById(
              savedWishlist._id
            ).populate("items.book");
            res
              .status(200)
              .json({ success: true.valueOf, wishlist: updatedWishlist });
          } else {
            res
              .status(200)
              // .json({ success: true, message: "Product already in wishlist!" });
              .json({
                success: true,
                message: "Product already in wishlist!",
                wishlist,
              });
          }
          break;
        }
        case "REMOVE_FROM_WISHLIST": {
          const wishlistItemIndex = wishlist.items.findIndex(
            (item) => item.book._id == bookId
          );
          if (wishlistItemIndex !== -1) {
            wishlist.items.splice(wishlistItemIndex, 1);
            const updatedWishlist = await wishlist.save();
            if (!updatedWishlist) {
              return res.status(500).json({
                success: false,
                message: "Error in removing from wishlist.",
              });
            }
            res.status(200).json({ success: true, wishlist: updatedWishlist });
          } else {
            res
              .status(400)
              .json({ success: false, message: "Product not in wishlist!" });
          }
          break;
        }
        default:
          return res.json({ success: true, wishlist });
        // default: return res.status(400).json({success: true, wishlist});
      }
    } catch (error) {
      console.error(error);
      res
        .status(+error.code)
        .json({ success: false, message: "Error in updating wishlist." });
    }
  });

module.exports = router;
