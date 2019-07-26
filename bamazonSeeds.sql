DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    itemID INTEGER NOT NULL AUTO_INCREMENT,
    productName VARCHAR(75) NOT NULL,
    deptName VARCHAR(75) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stockQuantity INTEGER(10) NOT NULL,
    PRIMARY KEY (itemID)
);

INSERT INTO products (productName, deptName, price, stockQuantity)
VALUES ("Eggo Waffles", "Grocery", 1.80, 50);

INSERT INTO products (productName, deptName, price, stockQuantity)
VALUES ("Fisher MC-4550 Audio System", "Audio", 250.00, 6);

INSERT INTO products (productName, deptName, price, stockQuantity)
VALUES ("22-Inch Color TV", "Electronics", 700.00, 4);

INSERT INTO products (productName, deptName, price, stockQuantity)
VALUES ("Polaroid Camera", "Photography", 93.75, 10);

INSERT INTO products (productName, deptName, price, stockQuantity)
VALUES ("Western Electric 554 Yellow Wall Phone", "Electronics", 19.95, 22);

INSERT INTO products (productName, deptName, price, stockQuantity)
VALUES ("Pentax MX SLR Camera", "Photography", 968.00, 3);

INSERT INTO products (productName, deptName, price, stockQuantity)
VALUES ("Reese's Pieces", "Grocery", .42, 100);

INSERT INTO products (productName, deptName, price, stockQuantity)
VALUES ("1976 Ford Pinto", "Automotive", 1919.00, 1);

INSERT INTO products (productName, deptName, price, stockQuantity)
VALUES ("TRC-214 Walkie-Talkies", "Electronics", 29.95, 12);

INSERT INTO products (productName, deptName, price, stockQuantity)
VALUES ("JVC Portable Camcorder", "Photography", 699.95, 5);