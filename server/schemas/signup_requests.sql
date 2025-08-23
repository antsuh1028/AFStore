CREATE TABLE IF NOT EXISTS signup_requests (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  company VARCHAR(255) NOT NULL,
  company_address_1 VARCHAR(255),
  company_address_2 VARCHAR(255),
  zip_code VARCHAR(20),
  city VARCHAR(100),
  state VARCHAR(50),
  phone VARCHAR(20),
  california_resale VARCHAR(100),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 