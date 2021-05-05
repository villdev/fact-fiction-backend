const { Schema, model } = require("mongoose");

const genreSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    // items: [
    //   {
    //     book: { type: Schema.Types.ObjectId, ref: "Book" },
    //   },
    // ],
    items: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  },
  { timestamps: true }
);

module.exports = model("Genre", genreSchema);
// const Genre = model("Genre", genreSchema);
// module.exports = { Genre };
