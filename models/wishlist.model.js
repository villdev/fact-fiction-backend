const { Schema, model } = require("mongoose");

const wishlistSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    items: [
      {
        book: { type: Schema.Types.ObjectId, ref: "Book" },
        format: {
          type: String,
          enum: {
            values: ["paperback", "hardcover", "ebook"],
            message: "{VALUE} format not supported",
          },
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Wishlist", wishlistSchema);
