// Requiring modules
var mysql = require("mysql");
var inquirer = require('inquirer');
const chalk = require('chalk');
var ui = require('cliui')();
var lowUI = require('cliui')();

// Track if first time using functions
var firstLogin = true;
var viewProductsFirst = true;
var viewLowFirst = true;

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

  startManaging();

});

function startManaging() {

    if (firstLogin) {

        console.clear();

        console.log(chalk.green("\r\n---------------------------------------------------"));
        console.log("     WELCOME TO BAMAZON " + chalk.green("- you are logged in"));
        console.log(chalk.green("---------------------------------------------------\r\n"));
        firstLogin = false;
    }

    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Menu Options:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(choice => {
        
        switch(choice.options) {

            case "View Products for Sale":
            viewProducts();
            break;
            
            case "View Low Inventory":
            viewLowInventory();
            break;
            
            case "Add to Inventory":
            addToInventory();
            break;
            
            case "Add New Product":
            addNewProduct();
            break;

            case "Exit":
            console.log("\r\nGood Bye.\r\n");
            connection.end();
            break;
        }
     
    });

}; // End of startManaging()

function viewProducts() {

    console.clear();

    console.log(chalk.cyan("\r\n---------------------------------------------------"));
    console.log(chalk.cyan("                 PRODUCTS FOR SALE"));
    console.log(chalk.cyan("--------------------------------------------------- \r\n"));
    
    // Listing out all products
    connection.query("SELECT * FROM products ORDER BY department_name, product_name", function(error, results) {
        if (error) throw error;

        // Creating a string to be used in the cliui module to display items in columns
        var productList =
        "ITEM ID \t PRODUCT NAME \t DEPARTMENT \t PRICE \t STOCK \n" + 
        "------- \t ------------ \t ---------- \t ----- \t ----- \n";

        // Looping through all the items in the database
        for ( var i = 0; i < results.length; i++ ) {
            productList += results[i].item_id + "\t " + results[i].product_name + "\t "  + results[i].department_name + "\t $"  + results[i].price.toFixed(2) + "\t " + results[i].stock_quantity + "\n";
        }
        
        // Need to put ui.div in a conditional so it doesn't duplicate the table
        if (viewProductsFirst) {
            // Displays everything nicely in columns
            ui.div(productList);
            viewProductsFirst = false;
        }
        console.log(ui.toString());

        console.log(chalk.cyan("\r\n---------------------------------------------------"));
        console.log("          What would you like to do next?");
        console.log(chalk.cyan("--------------------------------------------------- \r\n"));

        startManaging();

    });

} // End of viewProducts()

function viewLowInventory() {

    console.clear();

    console.log(chalk.cyan("\r\n---------------------------------------------------"));
    console.log(chalk.cyan("                   LOW INVENTORY"));
    console.log(chalk.cyan("--------------------------------------------------- \r\n"));
    
    // Listing out all products with inventory count lower than 5
    connection.query("SELECT * FROM products WHERE stock_quantity < 5 ORDER BY department_name, product_name", function(error, results) {
        if (error) throw error;

        // Creating a string to be used in the cliui module to display items in columns
        var productList =
        "ITEM ID \t PRODUCT NAME \t DEPARTMENT \t PRICE \t STOCK \n" + 
        "------- \t ------------ \t ---------- \t ----- \t ----- \n";

        // Looping through all the items in the database
        for ( var i = 0; i < results.length; i++ ) {
            productList += results[i].item_id + "\t " + results[i].product_name + "\t "  + results[i].department_name + "\t $"  + results[i].price.toFixed(2) + "\t " + results[i].stock_quantity + "\n";
        }
        
        // Need to put ui.div in a conditional so it doesn't duplicate the table
        if (viewLowFirst) {
            // Displays everything nicely in columns
            lowUI.div(productList);
            viewLowFirst = false;
        }
        console.log(lowUI.toString());

        console.log(chalk.cyan("\r\n---------------------------------------------------"));
        console.log("          What would you like to do next?");
        console.log(chalk.cyan("--------------------------------------------------- \r\n"));

        startManaging();

    });

} // End of viewLowInventory()

function addToInventory() {

    console.clear();

    console.log(chalk.cyan("\r\n---------------------------------------------------"));
    console.log(chalk.cyan("                 ADD TO INVENTORY"));
    console.log(chalk.cyan("--------------------------------------------------- \r\n"));

    // Array for products to list in the inquirer
    var productInquirer = [];
    
    // Listing out all products
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;

        // Looping through all the items in the database
        // Push product name to productInquirer array
        for ( var i = 0; i < results.length; i++ ) {
            productInquirer.push(results[i].product_name);
        }

        // Prompt user for action
        inquirer.prompt([
            {
                name: "product",
                type: "list",
                choices: productInquirer,
                message: "What item would you like to update?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units would you like to add?",
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

                    // Subtract quantity purchase from the stock quantity
                    result[0].stock_quantity += parseInt(answer.quantity);

                    // Update the quantity in the database
                    connection.query(
                        "UPDATE products SET stock_quantity = ? WHERE product_name = ?", [result[0].stock_quantity, answer.product], function(error) {
                            if (error) throw error;

                            console.log(chalk.green("\r\nYou have updated " + answer.product + " to " + result[0].stock_quantity + " units\r\n"));

                            console.log(chalk.cyan("\r\n---------------------------------------------------"));
                            console.log("          What would you like to do next?");
                            console.log(chalk.cyan("--------------------------------------------------- \r\n"));

                            // Prompt user if they want they want to do something else
                            startManaging();

                        }
                    );

                }
            );
        }); // End of inquirer

    });

} // End of addToInventory()

function addNewProduct() {

    console.clear();

    console.log(chalk.cyan("\r\n---------------------------------------------------"));
    console.log(chalk.cyan("                  ADD NEW PRODUCT"));
    console.log(chalk.cyan("--------------------------------------------------- \r\n"));

    // Empty array to push departments into
    var departments = [];
    
    // Listing out all products
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;

        // Looping through all the items in the database
        // Push the department name into the array if it doesn't already exist
        for ( var i = 0; i < results.length; i++ ) {
            if (!departments.includes(results[i].department_name)) {
                departments.push(results[i].department_name);
            }
        }

    });

    // Prompt user for action
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "What is the name of the product?"
        },
        {
            name: "department_name",
            type: "list",
            message: "What department?",
            choices: departments
        },
        {
            name: "price",
            type: "input",
            message: "What is the price?",
            validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
            }
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "What is the quantity?",
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
            "INSERT INTO products SET ?",
            {
                product_name: answer.product_name,
                department_name: answer.department_name,
                price: answer.price,
                stock_quantity: answer.stock_quantity
            },
            function(error, result) {
                if (error) throw error;

                var unit = "unit";
                if (answer.stock_quantity > 1 ) {
                    unit = "units";
                }

                console.log(chalk.green("\r\nYou have added " + answer.stock_quantity + " " + unit + " of " + answer.product_name + " to the shop.\r\n"));

                console.log(chalk.cyan("\r\n---------------------------------------------------"));
                console.log("          What would you like to do next?");
                console.log(chalk.cyan("--------------------------------------------------- \r\n"));

                // Prompt user if they want they want to do something else
                startManaging();

            }
        );
    }); // End of inquirer

} // End of addNewProduct()