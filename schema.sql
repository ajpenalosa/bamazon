DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
	product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INT
);

ALTER TABLE products
ADD product_sales DECIMAL(10,2);

CREATE TABLE departments (
	department_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    department_name VARCHAR(100),
    over_head_costs DECIMAL(10,2)
);

SELECT * FROM products;
SELECT * FROM departments;

-- UPDATE products SET stock_quantity = 12, product_sales = 0
-- WHERE item_id = 2;

SELECT departments.department_id, departments.department_name, departments.over_head_costs
FROM products
INNER JOIN departments ON departments.department_name=products.department_name
GROUP BY departments.department_name ASC;