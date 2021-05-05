const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    rating: { type: Number, required: true },
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    book: { type: Schema.Types.ObjectId, ref: "Book" },
    agree: {
      count: { type: Number },
      users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Review", reviewSchema);
