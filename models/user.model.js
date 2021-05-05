const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // avatar
    addresses: [
      {
        firstName: {
          type: String,
          required: [true, "First name not specified"],
        },
        lastName: {
          type: String,
          required: [true, "Last name not specified"],
        },
        streetAddress: {
          type: String,
          required: [true, "Street address not specified"],
        },
        aptNumber: {
          type: String,
          required: [true, "Appartment number not specified"],
        },
        state: { type: String, required: [true, "State not specified"] },
        zipcode: { type: Number, required: [true, "Zip code not specified"] },
      },
    ],
    paymentMethods: [
      {
        cardHolderName: {
          type: String,
          required: [true, "Card holder's name not specified"],
        },
        cardNumber: {
          type: Number,
          required: [true, "Card number not specified"],
        },
        expiryDate: {
          month: {
            type: Number,
            required: [true, "Expiry date not specified"],
          },
          year: { type: Number, required: [true, "Expiry date not specified"] },
        },
        cvv: { type: Number, required: [true, "CVV not specified"] },
      },
    ],
    wishlist: { type: Schema.Types.ObjectId, ref: "Wishlist" },
    cart: { type: Schema.Types.ObjectId, ref: "Cart" },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
