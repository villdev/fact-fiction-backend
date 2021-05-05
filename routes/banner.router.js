const router = require("express").Router();
const Banner = require("../models/banner.model");
// const { Banner } = require("../models/banner.model");
const bannerData = require("../bannerData");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const allBanners = await Banner.find({});
      if (!allBanners) {
        res.status(404).json({ success: false, message: "No banners found!" });
      }
      res.status(200).json({ success: true, banners: allBanners });
      //* res.status(200).json({success: true, banners: {allBanners}})
    } catch (error) {
      console.error(error);
      // ! change status code-------------------------------------------
      res
        .status(500)
        .json({ success: false, message: "Error while retrieving banners." });
    }
  })
  .post(async (req, res) => {
    try {
      bannerData.forEach(async (banner) => {
        const bannerPresent = await Banner.findOne({ title: banner.title });
        if (bannerPresent) return;

        const newBanner = new Banner({
          title: banner.title,
          subTitle: banner.subTitle,
          coverImage: banner.coverImage,
          description: banner.description,
          buttonText: banner.buttonText,
          link: banner.link,
        });

        const savedBanner = await newBanner.save();
        if (!savedBanner) {
          res
            .status(500)
            .json({ success: false, message: "Could not create the banner." });
        }
      });
      res.status(201).json({
        success: true,
        message: "Successfully added all banners to the database.",
      });
    } catch (error) {
      console.error(error);
      res.status(+error.code).json({
        success: false,
        message: "Failed to add all banners to the database.",
      });
    }
  });

module.exports = router;
