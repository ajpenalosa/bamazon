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

  startManaging();

});

function startManaging() {

    if (firstLogin) {

        console.clear();

        console.log(chalk.cyan("\r\n------------------------------"));
        console.log(chalk.cyan("     YOU ARE LOGGED IN"));
        console.log(chalk.cyan("------------------------------\r\n"));
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
        }
     
    });

}; // End of startManaging()

function viewProducts() {
    
    // Listing out all products
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;

        // Creating a string to be used in the cliui module to display items in columns
        var productList = 
        chalk.cyan("\r\n\t ------------------------------- \t \n") +
        chalk.cyan("\t         PRODUCTS FOR SALE \n") + 
        chalk.cyan("\t ------------------------------- \t \r\n\n") +
        "ITEM ID \t PRODUCT NAME \t DEPARTMENT \t PRICE \t STOCK \n" + 
        "------- \t ------------ \t ---------- \t ----- \t ----- \n";

        // Looping through all the items in the database
        for ( var i = 0; i < results.length; i++ ) {
            productList += results[i].item_id + "\t " + results[i].product_name + "\t "  + results[i].department_name + "\t "  + results[i].price + "\t " + results[i].stock_quantity + "\n";
        }
        
        // Displays everything nicely in columns
        ui.div(productList);
        console.log(ui.toString());

        startManaging();

    });

} // End of viewProducts()

function viewLowInventory() {
    
    // Listing out all products with inventory count lower than 5
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(error, results) {
        if (error) throw error;

        // Creating a string to be used in the cliui module to display items in columns
        var productList = 
        chalk.cyan("\r\n\t ------------------------------- \t \n") +
        chalk.cyan("\t         LOW INVENTORY \n") + 
        chalk.cyan("\t ------------------------------- \t \r\n\n") +
        "ITEM ID \t PRODUCT NAME \t DEPARTMENT \t PRICE \t STOCK \n" + 
        "------- \t ------------ \t ---------- \t ----- \t ----- \n";

        // Looping through all the items in the database
        for ( var i = 0; i < results.length; i++ ) {
            productList += results[i].item_id + "\t " + results[i].product_name + "\t "  + results[i].department_name + "\t "  + results[i].price + "\t " + results[i].stock_quantity + "\n";
        }
        
        // Displays everything nicely in columns
        ui.div(productList);
        console.log(ui.toString());

        startManaging();

    });

} // End of viewLowInventory()

function addToInventory() {

} // End of addToInventory()

function addNewProduct() {

} // End of addNewProduct()