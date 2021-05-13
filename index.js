require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/book.router");
const bannerRoutes = require("./routes/banner.router");
const genreRoutes = require("./routes/genre.router");
const userRoutes = require("./routes/user.router");
const cartRoutes = require("./routes/cart.router");
const wishlistRoutes = require("./routes/wishlist.router");

const app = express();
// app.set("Access-Control-Allow-Credentials", true);
// app.use(cors({ origin: "http://localhost:1234", credentials: true }));
// app.use(cors({ origin: true, credentials: true }));
// app.use(cors({ origin: true }));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server working fine :D" });
});
app.use("/books", bookRoutes);
app.use("/banners", bannerRoutes);
app.use("/genres", genreRoutes);
app.use("/users", userRoutes);
app.use("/carts", cartRoutes);
app.use("/wishlists", wishlistRoutes);

connectDB();

app.listen(process.env.PORT || 3000);
