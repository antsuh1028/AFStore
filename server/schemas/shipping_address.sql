CREATE TABLE "Shipping_Address" (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    postal_code INTEGER NOT NULL,
    country VARCHAR(255) NOT NULL,
    is_default BOOLEAN NOT NULL,
    address_type VARCHAR(20) CHECK (address_type IN ('shipping', 'billing'))
);