INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
( "Jenga GIANT", "Toys & Games", 119.95, 10),
( "Monopoly", "Toys & Games", 13.59, 12),
( "Operation", "Toys & Games", 14.79, 5),
( "Super Smash Bros. Ultimate", "Video Games", 59.99, 4),
( "State of Decay 2", "Video Games", 29.88, 2),
( "Fort Nite", "Video Games", 59.99, 3),
( "Black Panther", "Movies", 17.00, 6),
( "Justice League", "Movies", 10.00, 7),
( "Jumanji", "Movies", 10.10, 2),
( "Sony 60-Inch 4K Ultra HD TV", "Television & Video", 698.00, 10),
( "LG 65-Inch 4K Ultra HD TV", "Television & Video", 939.00, 10),
( "Samsung 65-Inch 4K UHD TV", "Television & Video", 1397.99, 0);

SELECT * FROM products;

INSERT INTO departments (department_name, over_head_costs)
VALUES
("Toys & Games", 10000),
("Video Games", 20000),
("Movies", 30000),
("Television & Video", 100000);

SELECT * FROM departments;