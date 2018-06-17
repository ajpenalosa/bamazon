// Requiring modules
var mysql = require("mysql");
var inquirer = require('inquirer');
var ui = require('cliui')();

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

    console.log("\r\n------------------------------");
    console.log("     WELCOME TO BAMAZON");
    console.log("------------------------------\r\n");
    
    // Listing out all products
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;

        // Creating a string to be used in the cliui module to display items in columns
        var productList = "ITEM ID \t PRODUCT NAME \t DEPARTMENT \t PRICE\t STOCK \n" + "------- \t ------------\t ----------\t -----\t -----\n";

        // Looping through all the items in the database
        for ( var i = 0; i < results.length; i++ ) {
            productList += results[i].item_id + "\t " + results[i].product_name + "\t "  + results[i].department_name + "\t "  + results[i].price + "\t " + results[i].stock_quantity + "\n";
            productInquirer.push(results[i].product_name);
        }
        
        // Displays everything nicely in columns
        ui.div(productList);
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

                    // If there is enough stock, continue with purchase
                    if ( result[0].stock_quantity > answer.quantity ) {

                        // Subtract 1 from the quantity
                        result[0].stock_quantity -= answer.quantity;

                        // Update the quantity in the database
                        connection.query(
                            "UPDATE products SET stock_quantity = ? WHERE product_name = ?", [result[0].stock_quantity, answer.product], function(error) {
                                if (error) throw error;

                                console.log("\r\nThank you for your purchase. You will get an e-mail confirmation when your item ships.\r\n");

                                makeAnotherPurchase();

                            }
                        );

                    }
                    else {
                        // If not enough stock, notify user it is out of stock
                        console.log("\r\nSorry! Insufficient quantity.\r\n");

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