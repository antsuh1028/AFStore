CREATE TABLE "CartItem" (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    date_added DATE NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES "Cart"(id),
    FOREIGN KEY (item_id) REFERENCES "Item"(id)
);