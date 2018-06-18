// Requiring modules
var mysql = require("mysql");
var inquirer = require('inquirer');
const chalk = require('chalk');
var ui = require('cliui')();

// Track if first time running functions
var firstLogin = true;
var viewProductSalesFirst = true;

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

  startSupervising();

});

function startSupervising() {

    if (firstLogin) {

        console.clear();

        console.log(chalk.green("\r\n---------------------------------------------------"));
        console.log(chalk.green("     YOU ARE LOGGED IN"));
        console.log(chalk.green("---------------------------------------------------\r\n"));
        firstLogin = false;
    }

    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Menu Options:",
            choices: ["View Products Sales by Department", "Create New Department", "Exit"]
        }
    ]).then(choice => {
        
        switch(choice.options) {

            case "View Products Sales by Department":
            viewProductSales();
            break;
            
            case "Create New Department":
            createDepartment();
            break;

            case "Exit":
            console.log("\r\nGood Bye.\r\n");
            connection.end();
            break;
        }
     
    });

}; // End of startSupervising()

function viewProductSales() {
    
    connection.query("SELECT ANY_VALUE(departments.department_id) AS department_id, departments.department_name, ANY_VALUE(departments.over_head_costs) as over_head_costs, ANY_VALUE(products.product_sales) AS product_sales, ANY_VALUE(products.product_sales) - ANY_VALUE(departments.over_head_costs) AS total_profit FROM products INNER JOIN departments ON departments.department_name=products.department_name GROUP BY departments.department_name ASC",function(error, results) {
        if (error) throw error;

        console.clear();

        console.log(chalk.cyan("\r\n---------------------------------------------------"));
        console.log(chalk.cyan("        PRODUCT SALES BY DEPARTMENT"));
        console.log(chalk.cyan("--------------------------------------------------- \r\n"));

        // Declaring variables to be used for the table
        var departmentID =  "DEPARTMENT ID \n ------------- \n";
        var departmentName = "DEPARTMENT NAME \n --------------- \n";
        var overheadCosts = "OVERHEAD COSTS \n -------------- \n";
        var productSales = "PRODUCT SALES \n ------------- \n";
        var totalProfit = "TOTAL PROFIT \n ------------ \n";
    
        // Looping through all the items in the joined table
        for ( var i = 0; i < results.length; i++ ) {

            departmentID += results[i].department_id + "\n ";
            departmentName += results[i].department_name + "\n ";
            overheadCosts += results[i].over_head_costs.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "\n ";
            productSales += results[i].product_sales.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "\n ";
            totalProfit += results[i].total_profit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "\n ";

        }

        // Need to put ui.div in a conditional so it doesn't duplicate the table
        if (viewProductSalesFirst) {

            // Displays everything nicely in columns
            ui.div(
              {
                text: departmentID
              },
              {
                text: departmentName
              },
              {
                text: overheadCosts,
                align: "right"
              },
              {
                text: productSales,
                align: "right"
              },
              {
                text: totalProfit,
                align: "right"
              }
            )
            viewProductSalesFirst = false;
        }
        console.log(ui.toString());

        startSupervising();

    });

} // End of viewProductSales()

function createDepartment() {

    console.clear();

    console.log(chalk.cyan("\r\n---------------------------------------------------"));
    console.log(chalk.cyan("     CREATE A NEW DEPARTMENT DEPARTMENT"));
    console.log(chalk.cyan("--------------------------------------------------- \r\n"));

    // Prompt user for action
    inquirer.prompt([
        {
            name: "department_name",
            type: "input",
            message: "What is the name of the department?"
        },
        {
            name: "over_head_costs",
            type: "input",
            message: "What are the overhead costs?",
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
            "INSERT INTO departments SET ?",
            {
                department_name: answer.department_name,
                over_head_costs: answer.over_head_costs
            },
            function(error, result) {
                if (error) throw error;

                console.log(chalk.green("\r\nYou have added " + answer.department_name + " to the system.") + "\r\nWhat would you like to do next?\r\n");

                // Prompt user if they want they want to do something else
                startSupervising();

            }
        );
    }); // End of inquirer
    
} // End of createDepartment()