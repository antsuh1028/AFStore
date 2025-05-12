CREATE TABLE "Item" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    images TEXT[] NULL,
    price INTEGER NOT NULL,
    brand VARCHAR(255) NOT NULL,
    grade VARCHAR(255) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    spec VARCHAR(255) NOT NULL,
    avg_weight INTEGER NOT NULL
);
