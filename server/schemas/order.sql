CREATE TABLE "Order" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'received')),
    total_amount INTEGER NOT NULL,
    shipping_address INTEGER,
    billing_address INTEGER,
    order_number VARCHAR(256) NOT NULL;
    FOREIGN KEY (user_id) REFERENCES "User"(id),
    FOREIGN KEY (shipping_address) REFERENCES "Shipping_Address"(id),
    FOREIGN KEY (billing_address) REFERENCES "Shipping_Address"(id)
);