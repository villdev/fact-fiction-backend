const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        book: { type: Schema.Types.ObjectId, ref: "Book" },
        quantity: { type: Number, default: 1 },
        format: {
          type: String,
          enum: {
            values: ["paperback", "hardcover", "ebook"],
            message: "{VALUE} format not supported",
          },
        },
        // * add these details in backend / db or not ?????
        // originalPrice: { type: Number, required: true },
        // sellingPrice: { type: Number, required: true },
        // discount: { type: Number, required: true },
      },
    ],
    checkout: {
      subtotal: { type: Number, default: 0 },
      deliveryCharges: { type: Number, default: 40 },
      discountTotal: { type: Number, default: 0 },
      total: { type: Number, default: 40 },
    },
  },
  { timestamps: true }
);

module.exports = model("Cart", cartSchema);
