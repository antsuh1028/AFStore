CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  license_number VARCHAR(20),
  phone_number TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  company TEXT,
  california_resale TEXT,
  disabled BOOLEAN DEFAULT FALSE,
  password VARCHAR(255) NOT NULL,
);