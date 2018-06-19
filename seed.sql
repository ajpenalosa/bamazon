INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES
( "Jenga GIANT", "Toys & Games", 119.95, 10, 4000),
( "Monopoly", "Toys & Games", 13.59, 12, 3000),
( "Operation", "Toys & Games", 14.79, 1, 5000),

( "Super Smash Bros. Ultimate", "Video Games", 59.99, 3, 10000),
( "State of Decay 2", "Video Games", 29.88, 20, 10000),
( "Fort Nite", "Video Games", 59.99, 1, 10000),
( "Black Panther", "Movies", 17.00, 40, 12000),
( "Justice League", "Movies", 10.00, 60, 14000),
( "Jumanji", "Movies", 10.10, 2, 5000),

( "Sony 60-Inch 4K Ultra HD TV", "Television & Video", 698.00, 10, 40000),
( "LG 65-Inch 4K Ultra HD TV", "Television & Video", 939.00, 5, 40000),
( "Samsung 65-Inch 4K UHD TV", "Television & Video", 1397.99, 3, 40000);

SELECT * FROM products;

INSERT INTO departments (department_name, over_head_costs, total_profit)
VALUES
("Toys & Games", 10000, 20000),
("Video Games", 20000, 30000),
("Movies", 30000, 40000),
("Television & Video", 100000, 80000);

SELECT * FROM departments;