//Requiring the modules mysql and inquirer 
var mysql = require("mysql");
var inquirer = require("inquirer");

//connecting to the database 
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

//connecting to mysql database using nodeJS 
connection.connect(function(err) {
    if (err) throw err;

    //this message appears when you've been connected to mysql database
    console.log(`\nconnected as id! ${connection.threadId}\n`);
    readProducts();
});

//all the products available on bamazon are listed in the terminal/bash
function readProducts() {
    var productsArr = [];
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_id}|| Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}\n`);
            productsArr.push(res[i].item_id);
        }
        // console.log(productsArr);
        selectID(productsArr)
    });
}

//function for selecting an item to purchase
function selectID(productsArr) {
    inquirer
        .prompt({
            name: "id",
            type: "input",
            message: "Type in the ID of the product you would like to purchase:",
            validate: function (answer) {
                return answer > 0;
            }
        }).then(function (answer) {
            var itemID = answer.id;
            if (productsArr.includes(parseInt(itemID)) === true) {
                printRequestedProduct(itemID)
            } else {
                console.log("\nThat ID doesn't exist. Please try again\n");
                selectID();
            }
        });
}

//function for showing the details of the item the customer selected 
function printRequestedProduct(itemID) {
    var query = "SELECT * FROM products WHERE item_id=?";
    connection.query(query, [itemID], function (err, res, fields) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == itemID) {
                console.log(`\nYou selected ID ${itemID}. The item's information is below: \n`);
                console.log(`Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}\n`);
                var availableStock = res[i].stock_quantity;
                requestPurchase(itemID, availableStock);
            }
        }
    });
}

//function for requesting a number of units to purchase
function requestPurchase(itemID, availableStock) {
    inquirer
        .prompt({
            name: "units",
            type: "input",
            message: "How many units of this product would you like to purchase?", 
            validate: function(answer) {
                return answer > 0;
            }
        }).then(function (answer) {
            var requestedUnits = answer.units;
            console.log(`\nYou requested to purchase ${Math.floor(requestedUnits)} units of this product.\n`)
            if (requestedUnits > availableStock) {
                console.log(`There are not enough in stock!  Try again with another number.  There are only ${availableStock} in stock.\n`)
            } else {
                processPurchase(itemID, requestedUnits, availableStock)
            }
        });
}

//function for processing the order. If there aren't enough units in stock, the order is aborted. If there are enough units in stock, the requested number is subtracted.
function processPurchase(itemID, requestedUnits, availableStock) {
    var newStock = parseInt(availableStock) - Math.floor(requestedUnits);
    var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
    console.log(`\nYou've purchased the product!  There are now ${newStock} left for ID ${itemID}\n`);
    connection.query(query, [newStock, itemID], function(err, res) {
        // the console.log below is to check the results
        // console.log(res.affectedRows);  
    });
    quitOrBuy();
}

// function to ask the customer if they want to purchase another item or if they want to quit the program
function quitOrBuy() {
    inquirer
        .prompt({
            name: "end_choice",
            type: "list",
            message: "Would you like to purchase another item or would you like to exit the application?",
            choices: ["I want to buy another item!", "I want to exit this application."]
        }).then(function (answer) {
            if (answer.end_choice == "I want to buy another item!") {
                readProducts()
            } else {
                console.log("\nGoodbye, come again!\n");
                connection.end();
            }

        });
}






