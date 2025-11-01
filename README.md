# 📚 Personal Library

A simple **Node.js + Express** web application that lets you search books via the **OpenLibrary API**, store them in your **PostgreSQL personal collection**, and manage your library (add/remove) through a clean web interface built with **EJS** templates.

---

## 🏗️ Project Overview

**Personal Library** allows users to:

- 🔎 Search books by title using the [OpenLibrary API](https://openlibrary.org/developers/api)
- 💾 Save selected books to a PostgreSQL database
- 🗑️ Remove books from their personal collection
- 🔁 Manage **many-to-many relationships** between books and authors

---

## 🧩 Tech Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| **Backend**     | Node.js, Express.js              |
| **Frontend**    | EJS templates, HTML, CSS         |
| **Database**    | PostgreSQL                       |
| **API**         | OpenLibrary (book data & covers) |
| **Environment** | dotenv                           |
| **HTTP**        | Axios                            |

---

## 🗂️ Project Structure

personal-library/
│
├── docs/
│ └── personal_library_db.drawio # Database architecture diagram
│
├── public/ # Static files (CSS, images)
│
├── views/ # EJS templates
│ ├── partials/ # Header/footer includes
│ ├── index.ejs # Library display page
│ └── search.ejs # Search results page
│
├── .env # PostgreSQL credentials (ignored by Git)
├── .gitignore
├── index.js # Main Express server
├── package.json
├── queries.sql # SQL script for DB creation
└── README.md

---

## 🧠 Database Schema

The database includes **three tables**, with a **many-to-many** relationship between `books` and `authors`.

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

Create a .env file at the root of your project and set your PostgreSQL credentials:

PG_USER=your_username
PG_HOST=localhost
PG_DATABASE=personal_library
PG_PASSWORD=your_password
PG_PORT=5432

🚀 Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/yourusername/personal-library.git
cd personal-library

2️⃣ Install dependencies
npm install

3️⃣ Set up PostgreSQL

Create a new database named personal_library

Run the schema script:

psql -U your_username -d personal_library -f queries.sql

4️⃣ Configure environment

Add your PostgreSQL credentials to .env as shown above.

5️⃣ Run the server
node index.js


Then open: http://localhost:3000

🔍 Features

✅ Search books by title using the OpenLibrary API
✅ Add and remove books from your PostgreSQL library
✅ Store book–author relationships automatically
✅ Display book covers when available
✅ Clean, responsive EJS templates

🧪 Example Usage

Homepage: displays all saved books in your personal library.
Search page: lets you find and add new books.

Example API call:

GET https://openlibrary.org/search.json?title=harry+potter

🛠️ Future Improvements

🔐 Add user authentication (multi-user support)

🧾 Display more book details (genres, descriptions)

📱 Improve responsiveness and design

👨‍💻 Author

pilippp
```
