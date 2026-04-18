const express = require("express");
const cors = require("cors");
const { connectToDB, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// init app and middleware
const app = express();
app.use(cors());
app.use(express.json());

let db;
connectToDB((err) => {
  if (!err) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
    db = getDb();
  }
});

app.get("/books", async (request, response) => {
  // suport pagination
  const page = request.query.page || 0;
  const recordsPerPage = 5;
  const books = db.collection("books");
  try {
    const result = await books
      .find(
        { rating: { $gte: 4.4 } },
        // { projection: { author: 1, title: 1, _id: 0 } },
      )
      .sort({ author: 1 })
      .skip(page * recordsPerPage)
      .limit(recordsPerPage)
      .toArray();
    response.status(200).json({ books: result });
  } catch (err) {
    response.status(500).json({ err: "Could not retrieve books" });
  }
});

// get count of books
app.get("/books/count", async (req, res) => {
  try {
    const books = db.collection("books");
    const count = await books.find().count();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get single book
app.get("/books/:id", async (request, response) => {
  const id = request.params.id;
  console.log(id);
  if (ObjectId.isValid(id)) {
    const books = db.collection("books");
    try {
      const book = await books.findOne({ _id: new ObjectId(id) });
      response.status(200).json({ book });
    } catch (err) {
      response.status(500).json({ error: "Unable to find book" });
    }
  } else {
    response.status(500).json({ error: "Not a valid doc id" });
  }
});

// create book
app.post("/books", async (req, res) => {
  const newbooks = req.body;
  // db.collection("books")
  //   .insertOne(book)
  //   .then((result) => {
  //     res.status(201).json({ result });
  //   })
  //   .catch((err) => console.log(err));

  const books = db.collection("books");
  try {
    const result = await books.insertMany(newbooks);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.delete("/books/:id", async (req, res) => {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    const books = db.collection("books");
    try {
      const result = await books.deleteOne({ _id: new ObjectId(id) });
      res.status(201).json({ result });
    } catch (err) {
      res.status(500).json({ err });
    }
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
});

app.patch("/books/:id", async (req, res) => {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    const updates = req.body;
    const books = db.collection("books");
    try {
      const result = await books.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates },
      );
      res.status(201).json({ result });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
});
