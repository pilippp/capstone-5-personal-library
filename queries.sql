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


-- realtion many - many --
CREATE TABLE books_authors (
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, author_id)
);