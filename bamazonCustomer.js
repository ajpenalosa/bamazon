// Requiring modules
var mysql = require("mysql");
var inquirer = require('inquirer');
const chalk = require('chalk');
var ui = require('cliui')();

// Track if first time logging in
var firstLogin = true;

// Connecting to database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "pG4>=fJH9h",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
//   console.log("connected as id " + connection.threadId);

  startShopping();

});

function startShopping() {

    // Array for products to list in the inquirer
    var productInquirer = [];

    console.clear();

    console.log(chalk.cyan("\r\n---------------------------------------------------"));
    console.log(chalk.cyan("                WELCOME TO BAMAZON"));
    console.log(chalk.cyan("--------------------------------------------------- \r\n"));
    
    // Listing out all products
    connection.query("SELECT * FROM products ORDER BY department_name, product_name", function(error, results) {
        if (error) throw error;

        // Creating a string to be used in the cliui module to display items in columns
        var productList = "ITEM ID \t PRODUCT NAME \t DEPARTMENT \t PRICE\n" + "------- \t ------------\t ----------\t -----\n";

        // Looping through all the items in the database
        for ( var i = 0; i < results.length; i++ ) {
            productList += results[i].item_id + "\t " + results[i].product_name + "\t "  + results[i].department_name + "\t $"  + results[i].price.toFixed(2) + "\n";
            productInquirer.push(results[i].product_name);
        }
        
        // Need to put ui.div in a conditional so it doesn't duplicate the table
        if (firstLogin) {
            // Displays everything nicely in columns
            ui.div(productList);
            firstLogin = false;
        }

        console.log(ui.toString());

        // Prompt user for action
        inquirer.prompt([
            {
                name: "product",
                type: "list",
                choices: productInquirer,
                message: "What item would you like to purchase?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units would you like to buy?",
                validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
                }
            }
            ])
            .then(function(answer) {

            // Finding the product in the database
            connection.query(
                "SELECT * FROM products WHERE product_name = ?", [answer.product], function(error, result) {
                    if (error) throw error;

                    // Displays "unit" or "units" depending on quantity
                    var unit = "unit";
                    if ( answer.quantity > 1 ) {
                        unit = "units";
                    }

                    // If there is enough stock, continue with purchase
                    if ( result[0].stock_quantity > answer.quantity ) {

                        // Calculating total price
                        var total = (result[0].price * answer.quantity).toFixed(2);

                        var productSales = parseInt(result[0].product_sales) + parseInt(total);

                        // Subtract quantity purchase from the stock quantity
                        result[0].stock_quantity -= answer.quantity;

                        // Update the quantity in the database
                        connection.query(
                            "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE product_name = ?", [result[0].stock_quantity, productSales, answer.product], function(error) {
                                if (error) throw error;

                                console.clear();
                                console.log(chalk.cyan("\r\n---------------------------------------------------"));
                                console.log(chalk.cyan("           THANK YOU FOR YOUR PURCHASE!"));
                                console.log(chalk.cyan("--------------------------------------------------- \r\n"));

                                console.log("\r\nYou have purchased " + answer.quantity + " " + unit + " of " + answer.product + ".");

                                console.log("\r\nYour order total is $" + total + "\r\n\nYou will receive an e-mail confirmation when your order ships.\r\n");

                                // Prompt user if they want to make another purchase
                                makeAnotherPurchase();

                            }
                        );

                    }
                    else {
                        console.clear();
                        console.log(chalk.cyan("\r\n---------------------------------------------------"));
                        console.log(chalk.cyan("           SORRY! INSUFFICIENT QUANTITY."));
                        console.log(chalk.cyan("--------------------------------------------------- \r\n"));

                        makeAnotherPurchase();
                    }
                }
            );
        }); // End of inquirer

    });

}; // End of startShopping()

function makeAnotherPurchase() {

    // Ask user if they would like to purchase something else
    inquirer.prompt([
        {
            name: "another",
            type: "confirm",
            message: "Would you like to purchase another item?"
        }
    ])
    .then(function(answer) {
        if ( answer.another ) {
            // Take user back to the beginning
            startShopping();
        }
        else {
            // If user chooses no, then end the connection
            console.log("\r\nThank you for shopping at bAmazon. See you next time!\r\n");
            connection.end();
        }
    })

} // End of makeAnotherPurchase()