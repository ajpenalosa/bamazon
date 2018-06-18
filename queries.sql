USE bamazon;

UPDATE products SET stock_quantity = 12, product_sales = 0
WHERE item_id = 2;

SELECT
ANY_VALUE(departments.department_id) AS department_id, 
departments.department_name,
ANY_VALUE(departments.over_head_costs) as over_head_costs,
ANY_VALUE(products.product_sales) AS product_sales,
ANY_VALUE(products.product_sales) - ANY_VALUE(departments.over_head_costs) AS total_profit

FROM products
INNER JOIN departments ON departments.department_name=products.department_name
GROUP BY departments.department_name ASC;