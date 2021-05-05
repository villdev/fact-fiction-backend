const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Wishlist = require("../models/wishlist.model");
const Cart = require("../models/cart.model");
// const {Book } = require("../models/book.model");
const userData = require("../userData");

router.param("userId", async (req, res, next, userId) => {
  try {
    // const userFound = await User.findById(userId).populate("wishlist").populate("cart");
    const userFound = await User.findById(userId)
      .populate({
        path: "wishlist",
        populate: {
          path: "items.book",
        },
      })
      .populate({
        path: "cart",
        populate: {
          path: "items.book",
        },
      });
    if (!userFound) {
      res.status(404).json({ success: false, message: "User not found!" });
    }
    req.user = userFound;
    next();
  } catch (error) {
    console.error(error);
    // ! change status code accordingly
    res
      .status(404)
      .json({ success: false, message: "Error while retrieving User." });
  }
});

router
  .route("/")
  .get(async (req, res) => {
    try {
      // * change below full block to if block in case req.query is empty, else depending on query, filter
      console.log(req.query);
      const allUsers = await User.find({});
      if (!allUsers) {
        res.status(404).json({ success: false, message: "No users found!" });
      }
      res.status(200).json({ success: true, users: allUsers });
      //* res.status(200).json({success: true, users: {allUsers} })
    } catch (error) {
      console.error(error);
      // !change status code
      res
        .status(404)
        .json({ success: false, message: "Error while retrieving users." });
    }
  })
  .post(async (req, res) => {
    try {
      userData.forEach(async (user) => {
        const userPresent = await User.findOne({ email: user.email });
        if (userPresent) return;

        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          name: user.name,
          email: user.email,
          password: user.password,
          addresses: user.addresses.map((address) => {
            return {
              firstName: address.firstName,
              lastName: address.lastName,
              streetAddress: address.streetAddress,
              aptNumber: address.aptNumber,
              state: address.state,
              zipcode: address.zipcode,
            };
          }),

          paymentMethods: user.paymentMethods.map((method) => {
            return {
              cardHolderName: method.cardHolderName,
              cardNumber: method.cardNumber,
              expiryDate: {
                month: method.expiryDate.month,
                year: method.expiryDate.year,
              },
              cvv: method.cvv,
            };
          }),
        });
        const savedUser = await newUser.save();
        if (!savedUser) {
          res
            .status(500)
            .json({ success: false, message: "Could not create the user." });
        }
        // creating empty cart for user if not present
        const cartPresent = await Cart.findOne({ user: savedUser._id });
        if (!cartPresent) {
          const newCart = new Cart({
            user: savedUser._id,
            // items: [],
            checkout: {
              subtotal: 0,
              deliveryCharges: 40,
              discountTotal: 0,
              total: 0,
            },
          });
          const savedCart = await newCart.save();
          if (!savedCart) {
            res.status(500).json({
              success: false,
              message: "Could not create the users cart.",
            });
          }
          // adding ref to wishlist to created user
          savedUser.cart = savedCart;
        }
        // creating empty wishlist for user if not present
        const wishlistPresent = await Wishlist.findOne({ user: savedUser._id });
        if (!wishlistPresent) {
          const newWishlist = new Wishlist({
            user: savedUser._id,
            // items: [],
          });
          const savedWishlist = await newWishlist.save();
          if (!savedWishlist) {
            res.status(500).json({
              success: false,
              message: "Could not create the users wishlist.",
            });
          }
          // adding ref to wishlist to created user
          savedUser.wishlist = savedWishlist;
        }
        // saving the modifications done to user (added cart and wishlist)
        const modifiedUser = await savedUser.save();
        if (!modifiedUser) {
          res.status(500).json({
            success: false,
            message: "Could not add the wishlist and cart to user.",
          });
        }
      });
      res.status(201).json({
        success: true,
        message: "Successfully added all users to the database.",
      });
    } catch (error) {
      console.error(error);
      res.status(+error.code).json({
        success: false,
        message: "Failed to add all users to database.",
      });
    }
  });

router.get("/:userId", async (req, res) => {
  try {
    res.status(200).json({ success: true, book: req.user });
    //* res.status(200).json({success: true, book: {...req.book}})
  } catch (error) {
    console.error(error);
    res
      .status(+error.code)
      .json({ success: false, message: "User not found in database." });
  }
});

module.exports = router;
