DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

create table products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR (30),
    department_name VARCHAR (30),
    price DECIMAL(10, 2),
    stock_quantity INT (10),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
 VALUES
    ("Laptop", "electronics", 500, 40),
    ("Cellphone", "electronics", 100, 60),
    ("Tablet", "electronics", 200, 50),
    ("Speaker", "electronics", 50, 30),
    ("Interface", "electronics", 75, 40),
    ("Laptop Case", "accessories", 40, 50),
    ("Cellphone Case", "accessories", 20, 50),
    ("Tablet Case", "accessories", 30, 50),
    ("Speaker Case", "accessories", 25, 30),
    ("Cable Kit", "accessories", 30, 80);