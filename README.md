# 📚 Personal Library

A simple **Node.js + Express** web application that lets you search books using the **OpenLibrary API**, add them to your **personal collection stored in PostgreSQL**, and manage (add/remove) your library through a clean web interface built with **EJS** templates.

---

## 🏗️ Project Overview

**Personal Library** allows users to:

- Search books by title via the [OpenLibrary API](https://openlibrary.org/developers/api).
- Save selected books to their own PostgreSQL-based library.
- Remove books from their personal collection.
- Automatically store author–book relationships in a **many-to-many** database schema.

---

## 🧩 Tech Stack

| Layer         | Technology                         |
| ------------- | ---------------------------------- |
| Backend       | Node.js, Express.js                |
| Frontend      | EJS templates, HTML, CSS           |
| Database      | PostgreSQL                         |
| API           | OpenLibrary (book data and covers) |
| Environment   | dotenv                             |
| HTTP Requests | Axios                              |

---

## 🗂️ Project Structure

personal-library/
│
├── docs/
│ └── personal_library_db.drawio # Database architecture diagram
│
├── node_modules/ # Dependencies (ignored by Git)
│
├── public/ # Static files (images, CSS)
│
├── views/ # EJS templates
│ ├── partials/ # Header/footer includes
│ ├── index.ejs # Home page (library display)
│ └── search.ejs # Search results page
│
├── .env # Environment variables for PostgreSQL
├── .gitignore
├── index.js # Main Express server file
├── package.json
├── queries.sql # SQL schema for database creation
└── README.md # You are here

---

## 🧠 Database Schema

The database contains **three tables** with a many-to-many relationship between books and authors.

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  work_key VARCHAR(50) UNIQUE NOT NULL,
  cover_key INTEGER,
  first_publish_year INTEGER,
  author_name VARCHAR(100)
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  author_key VARCHAR(50) UNIQUE
);

CREATE TABLE books_authors (
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, author_id)
);

⚙️ Environment Variables

Create a .env file at the root of the project and set your PostgreSQL credentials:
PG_USER=your_username
PG_HOST=localhost
PG_DATABASE=personal_library
PG_PASSWORD=your_password
PG_PORT=5432

🚀 Installation and Setup

Clone the repository
git clone https://github.com/yourusername/personal-library.git
cd personal-library

Install dependencies
npm install
Set up PostgreSQL

Create a new database named personal_library.
Run the SQL script to create tables:
psql -U your_username -d personal_library -f queries.sql

Configure environment
Add your PostgreSQL credentials in .env as shown above.

Run the server
node index.js:

Visit http://localhost:3000

🔍 Features
✅ Search books by title using OpenLibrary API
✅ Add selected books to your PostgreSQL library
✅ Remove books from your library
✅ Store book–author relationships automatically
✅ Display book covers when available
✅ Clean, responsive EJS templates

🧪 Example
Homepage: displays all books saved in your personal library.

Search Page: lets you find and add new books.

Example API call:

GET https://openlibrary.org/search.json?title=harry+potter

🛠️ Future Improvements
Add user authentication (so multiple users can have their own library)
Display additional book info (genres, descriptions)


🧑‍💻 Author
pilippp

```
