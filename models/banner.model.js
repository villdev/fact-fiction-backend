const { Schema, model } = require("mongoose");

const bannerSchema = new Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    coverImage: { type: String, required: true },
    description: { type: String, required: true },
    buttonText: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Banner", bannerSchema);
// const Banner = model("Banner", bannerSchema);
// module.exports = { Banner };
