const router = require("express").Router();
const mongoose = require("mongoose");
// const Book = require("../models/book.model");
const { Book } = require("../models/book.model");
const Genre = require("../models/genre.model");
const productData = require("../productData");

router.param("bookId", async (req, res, next, bookId) => {
  try {
    const bookFound = await Book.findOne({ _id: bookId });
    //* const bookFound = await Book.findById(bookId);
    if (!bookFound) {
      res.status(404).json({ success: false, message: "Book not found!" });
    }
    req.book = bookFound;
    next();
  } catch (error) {
    console.error(error);
    // ! change status code accordingly
    res
      .status(404)
      .json({ success: false, message: "Error while retrieving book." });
  }
});

router
  .route("/")
  .get(async (req, res) => {
    try {
      // * change below full block to if block in case req.query is empty, else depending on query, filter

      // pagination
      const page = parseInt(req.query.page);
      const results = parseInt(req.query.results);
      const startIndex = (page - 1) * results;
      const endIndex = page * results;

      // const allBooks = await Book.find({});
      // const allBooks = await Book.find({}).limit(results).skip(startIndex);
      const paginatedBooks = {};
      paginatedBooks.books = await Book.find({})
        .limit(results)
        .skip(startIndex);
      if (endIndex < paginatedBooks.books.length) {
        paginatedBooks.next = {
          page: page + 1,
          results,
        };
      }
      if (startIndex > 0) {
        paginatedBooks.previous = {
          page: page - 1,
          results,
        };
      }
      if (!paginatedBooks.books) {
        res.status(404).json({ success: false, message: "No books found!" });
      }
      res.status(200).json({ success: true, paginatedBooks });

      // if (!allBooks) {
      //   res.status(404).json({ success: false, message: "No books found!" });
      // }
      // res.status(200).json({ success: true, books: allBooks });
      //* res.status(200).json({success: true, books: {allBooks} })
    } catch (error) {
      console.error(error);
      // !change status code
      res
        .status(404)
        .json({ success: false, message: "Error while retrieving books." });
    }
  })
  //   todo:-----------below temp for setup----------------delete after db creation and before production------------------------
  .post(async (req, res) => {
    try {
      productData.forEach(async (book) => {
        const bookPresent = await Book.findOne({ name: book.name });
        if (bookPresent) return;

        const newBook = new Book({
          _id: new mongoose.Types.ObjectId(),
          name: book.name,
          authors: [...book.authors],
          covers: [...book.covers],
          synopsis: book.synopsis,
          formats: book.formats.map((format) => {
            return {
              type: format.type,
              price: format.price,
              discount: format.discount,
              stock: format.stock,
            };
          }),
          pages: book.pages,
          language: book.language,
          publishDate: book.publishDate,
          publisher: book.publisher,
          isbn10: book.isbn10,
          isbn13: book.isbn13,
          weight: book.weight,
          dimensions: book.dimensions,
          genres: [...book.genres],
        });

        const savedBook = await newBook.save();
        if (!savedBook) {
          res
            .status(500)
            .json({ success: false, message: "Could not create the book." });
        }
        // if book saved, see if any new genres.. and update genre db
        savedBook.genres.forEach(async (genre) => {
          const genrePresent = await Genre.findOne({ name: genre });
          if (!genrePresent.items.includes(savedBook._id)) {
            console.log("book name: ", savedBook.name);
            genrePresent.items.push(savedBook._id);
            const savedGenre = await genrePresent.save();
            if (!savedGenre) {
              res.status(500).json({
                success: false,
                message: "Could not updae the genre.",
              });
            }
          }
        });
      });
      res.status(201).json({
        success: true,
        message: "Successfully added all books to the database.",
      });
    } catch (error) {
      console.error(error);
      res.status(+error.code).json({
        success: false,
        message: "Failed to add all books to database.",
      });
    }
  });

router.get("/:bookId", async (req, res) => {
  try {
    res.status(200).json({ success: true, book: req.book });
    //* res.status(200).json({success: true, book: {...req.book}})
  } catch (error) {
    console.error(error);
    res
      .status(+error.code)
      .json({ success: false, message: "Book not found in database." });
  }
});

module.exports = router;
