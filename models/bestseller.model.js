const { Schema, model } = require("mongoose");

const bestsellerSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book" },
    rank: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = model("Bestseller", bestsellerSchema);
