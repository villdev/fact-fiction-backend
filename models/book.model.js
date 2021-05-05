const { Schema, model } = require("mongoose");

const bookSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    name: {
      type: String,
      required: [true, "Name of the book missing"],
      unique: true,
    },
    authors: [{ type: String, required: [true, "Author name missing"] }],
    covers: [
      {
        type: String,
        required: [true, "Cover image missing"],
        default:
          "https://images-na.ssl-images-amazon.com/images/I/51ifu1aebKL.jpg",
      },
    ],
    synopsis: { type: String, required: [true, "Book synopsis missing"] },
    ratings: {
      average: { type: Number, default: 0 },
      reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    },
    formats: [
      {
        type: {
          type: String,
          enum: {
            values: ["paperback", "hardcover", "ebook"],
            message: "Format type {VALUE} not supported",
          },
          required: [true, "Format type not specified"],
        },
        price: {
          type: Number,
          required: [true, "Price not specified"],
          default: 0,
        },
        discount: { type: Number, default: 0 },
        stock: { type: Number, required: true, default: 10 },
      },
    ],
    pages: {
      type: Number,
      required: [true, "Number of pages not specified"],
      default: 0,
    },
    language: {
      type: String,
      required: [true, "Book language not specified"],
      default: "English",
    },
    publishDate: { type: Date, required: true },
    publisher: { type: String, required: true },
    isbn10: { type: String, required: [true, "ISBN-10 missing"] },
    isbn13: { type: String, required: [true, "ISBN-13 missing"] },
    weight: { type: String, required: [true, "Book weight not specified"] },
    dimensions: {
      type: String,
      required: [true, "Book dimensions not specified"],
    },
    genres: [{ type: String, required: [true, "Book genre not specified"] }],
  },
  {
    timestamps: true,
  }
);

// module.export = model("Book", bookSchema);
const Book = model("Book", bookSchema);
module.exports = { Book };
