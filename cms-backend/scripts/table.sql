CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250),
    contactNumber VARCHAR(20),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    status VARCHAR(20),
    role VARCHAR(20)
);

INSERT INTO users (name, contactNumber, email, password, status, role) 
VALUES ('Admin', '9876543210', 'admin@gmail.com', 'admin', 'true', 'admin');

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    categoryId INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    description VARCHAR(255),
    price INTEGER CHECK (price >= 0),
    status BOOLEAN NOT NULL
);


CREATE TABLE bill (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(200) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    productDetails JSONB NOT NULL,
    createdBy VARCHAR(255) NOT NULL
);

