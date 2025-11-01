import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;

const API_URL_openlibrary = "https://openlibrary.org/search.json";

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let library = [];

app.get("/", async (req, res) => {
  try {
    // load the data from the database to the homepage
    const result = await db.query("SELECT * FROM books ORDER BY id ASC");
    library = result.rows;
    res.render("index.ejs", { title: "My personal library", library: library });
  } catch (err) {
    console.error("Error in GET / route:", err);
    return res.status(500).send("Erreur serveur");
  }
});

app.post("/search", async (req, res) => {
  const title = req.body.bookTitle;
  try {
    const query = encodeURIComponent(title);
    const url =
      API_URL_openlibrary +
      `?title=${query}&fields=key,title,author_name,cover_i,first_publish_year,author_key&limit=50`;

    const response = await axios.get(url);

    const books_found = response.data.docs;

    // Get only one book per work (many editions for one work so far)
    const uniqueBooks = [];
    const seenKeys = new Set();

    for (const book of books_found) {
      if (!seenKeys.has(book.key)) {
        seenKeys.add(book.key);
        uniqueBooks.push(book);
      }
    }

    // Limit of the results
    const books_sorted = uniqueBooks.slice(0, 15);

    res.render("search.ejs", { books: books_sorted });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error for the searching request");
  }
});

app.post("/add-book", async (req, res) => {
  //add book, author, and the relationship many-many to the database then redirect to root
  let book_id;
  let author_id;
  try {
    const bookResult = await db.query(
      "INSERT INTO books (title, work_key, cover_key,first_publish_year,author_name) VALUES ($1,$2,$3,$4,$5) RETURNING id",
      [
        req.body.title,
        req.body.work_key,
        req.body.cover_key,
        req.body.first_publish_year,
        req.body.author_name,
      ]
    );
    book_id = bookResult.rows[0].id;
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error insert into books");
  }
  try {
    const authorResult = await db.query(
      "INSERT INTO authors (name, author_key) VALUES ($1,$2) RETURNING id",
      [req.body.author_name, req.body.author_key]
    );
    author_id = authorResult.rows[0].id;
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error insert into authors");
  }
  try {
    await db.query(
      "INSERT INTO books_authors (book_id, author_id) VALUES ($1,$2)",
      [book_id, author_id]
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error insert into books_authors");
  }
  res.redirect("/");
});

app.post("/delete-book", async (req, res) => {
  const bookId = req.body.book_id;

  try {
    // Delete row relationship of the book_id
    await db.query("DELETE FROM books_authors WHERE book_id = $1", [bookId]);

    // Delete the book
    await db.query("DELETE FROM books WHERE id = $1", [bookId]);

    // Delete author who has no book registered in library
    const unusedAuthors = await db.query(
      `DELETE FROM authors a
       WHERE NOT EXISTS (
         SELECT 1 FROM books_authors ba WHERE ba.author_id = a.id
       ) RETURNING id`
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
