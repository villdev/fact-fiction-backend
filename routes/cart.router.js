const router = require("express").Router();
// const User = require("../models/user.model");
const { Book } = require("../models/book.model");
const Cart = require("../models/cart.model");

const getFormatDetails = (book, currentFormat) => {
  const currentFormatIndex = book.formats.findIndex(
    (format) => format.type === currentFormat
  );
  // return book.formats[currentFormatIndex];
  return {
    price: +book.formats[currentFormatIndex].price.toFixed(2),
    discount: +(
      (book.formats[currentFormatIndex].discount / 100) *
      book.formats[currentFormatIndex].price
    ).toFixed(2),
    stock: book.formats[currentFormatIndex].stock,
  };
};

router.param("cartId", async (req, res, next, cartId) => {
  try {
    const cartFound = await Cart.findById(cartId).populate("items.book");
    if (!cartFound) {
      res.status(404).json({ success: false, message: "Cart not found!" });
    }
    req.cart = cartFound;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(+error.code)
      .json({ success: false, message: "Error while retrieving cart." });
  }
});

router
  .route("/:cartId")
  .get(async (req, res) => {
    try {
      res.status(200).json({ success: true, cart: req.cart });
    } catch (error) {
      console.error(error);
      res
        .status(+error.code)
        .json({ success: false, message: "Cart not found in database." });
    }
  })
  .post(async (req, res) => {
    const cart = req.cart;
    const { action, bookId, quantity, format } = req.body;
    try {
      switch (action) {
        case "ADD_TO_CART": {
          // undef . false on not finding anything
          // todo add condition for zero stock---------------------------------

          // todo also add feature to add different format books at the same time---------------
          if (!cart.items.find((item) => item.book._id == bookId)) {
            const newCartItem = {
              book: bookId,
              quantity,
              format,
            };
            cart.items.push(newCartItem);
            const book = await Book.findById(bookId);
            const formatDetail = getFormatDetails(book, format);
            cart.checkout.subtotal += formatDetail.price;
            cart.checkout.discountTotal += formatDetail.discount;
            cart.checkout.total =
              cart.checkout.subtotal +
              cart.checkout.deliveryCharges -
              cart.checkout.discountTotal;

            cart.checkout.subtotal = +cart.checkout.subtotal.toFixed(2);
            cart.checkout.discountTotal =
              +cart.checkout.discountTotal.toFixed(2);
            cart.checkout.total = +cart.checkout.total.toFixed(2);
            const savedCart = await cart.save();
            if (!savedCart) {
              return res.status(500).json({
                success: false,
                message: "Error in adding product to cart.",
              });
            }
            const updatedCart = await Cart.findById(savedCart._id).populate(
              "items.book"
            );
            res.status(200).json({ success: true, cart: updatedCart });
          } else {
            res
              .status(200)
              .json({ success: true, message: "Product already in cart!" });
          }
          break;
        }
        case "UPDATE_QUANTITY": {
          // update can only be done from cart
          const cartItemIndex = cart.items.findIndex(
            (item) => item.book._id == bookId
          );
          const quantityModifiedValue =
            quantity - cart.items[cartItemIndex].quantity;
          // negative if quantity decreases | positive if quantity increases
          // TODO check if quantity goes above stock available-------------------------------------------
          // if(cart.items[cartItemIndex].quantity + quantity > cart.items[cartItemIndex].book.)
          //---------------------------------------------------------------------------------------

          // TODO also add condition to check if quantity value is always only -1 or 1

          // quantity cant go below 1
          if (quantity >= 1) {
            cart.items[cartItemIndex].quantity = quantity;
            const book = await Book.findById(bookId);
            const formatDetail = getFormatDetails(book, format);
            cart.checkout.subtotal +=
              quantityModifiedValue * formatDetail.price;
            cart.checkout.discountTotal +=
              quantityModifiedValue * formatDetail.discount;
            cart.checkout.total =
              cart.checkout.subtotal +
              cart.checkout.deliveryCharges -
              cart.checkout.discountTotal;

            cart.checkout.subtotal = +cart.checkout.subtotal.toFixed(2);
            cart.checkout.discountTotal =
              +cart.checkout.discountTotal.toFixed(2);
            cart.checkout.total = +cart.checkout.total.toFixed(2);
            const updatedCart = await cart.save();
            if (!updatedCart) {
              return res
                .status(500)
                .json({ success: false, message: "Error in upating quantity" });
            }
            res.status(200).json({ success: true, cart: updatedCart });
          } else {
            res
              .status(500)
              .json({ success: false, message: "Quantity cant go below 1!" });
          }
          break;
        }
        case "REMOVE_FROM_CART": {
          const cartItemIndex = cart.items.findIndex(
            (item) => item.book._id == bookId
          );
          if (cartItemIndex !== -1) {
            const removedQuantity = cart.items[cartItemIndex].quantity;
            cart.items.splice(cartItemIndex, 1);
            const book = await Book.findById(bookId);
            const formatDetail = getFormatDetails(book, format);
            cart.checkout.subtotal -= removedQuantity * formatDetail.price;
            cart.checkout.discountTotal -=
              removedQuantity * formatDetail.discount;
            cart.checkout.total =
              cart.checkout.subtotal +
              cart.checkout.deliveryCharges -
              cart.checkout.discountTotal;

            if (cart.items.length === 0) {
              cart.checkout.total = 0.0;
            }
            cart.checkout.subtotal = +cart.checkout.subtotal.toFixed(2);
            cart.checkout.discountTotal =
              +cart.checkout.discountTotal.toFixed(2);
            cart.checkout.total = +cart.checkout.total.toFixed(2);
            const updatedCart = await cart.save();
            if (!updatedCart) {
              return res.status(500).json({
                success: false,
                message: "Error in removing from cart!",
              });
            }
            res.status(200).json({ success: true, cart: updatedCart });
          } else {
            res
              .status(400)
              .json({ success: false, message: "Product not in cart!" });
          }
          break;
        }
        default:
          return res.json({ success: true, cart });
        // return res.status(400).json({ success: true, cart });
      }
    } catch (error) {
      console.error(error);
      res
        .status(+error.code)
        .json({ success: false, message: "Error in updating cart." });
    }
  });

module.exports = router;
