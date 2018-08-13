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
    console.log('connected as id!' + connection.threadId);
    readProducts();
});

//all the products available on bamazon are listed in the terminal/bash
function readProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_id}|| Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}\n`);
        }
        selectID()
    });
}

function selectID() {
    inquirer
        .prompt({
            name: "id",
            type: "input",
            message: "Type in the ID of the product you would like to purchase:"
        }).then(function(answer) {
            var itemID = answer.id;
            var query = "SELECT * FROM products WHERE item_id=?";
            connection.query(query, [itemID], function(err, res, fields) {
                for (var i = 0; i < res.length; i++) {
                    console.log(`You selected ID ${itemID}. The item's information is below: \n`);
                    console.log(`Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}\n`);
                    var availableStock = res[i].stock_quantity;
                } 
                requestPurchase(itemID, availableStock);
            });
        });
}

function requestPurchase(itemID, availableStock) {
    inquirer
    .prompt({
        name: "units",
        type: "input",
        message: "How many units of this product would you like to purchase?"
    }).then(function(answer) {
        var requestedUnits = answer.units;
            console.log(`You requested to purchase ${requestedUnits} units of this product.`)
            if (requestedUnits > availableStock) {
                console.log(`There are not enough in stock!  Try again with another number.  There are only ${availableStock} in stock.`)
            } else {
                processPurchase(itemID, requestedUnits, availableStock)
            }
        });
}

function processPurchase(itemID, requestedUnits, availableStock) {
    var newStock = availableStock - requestedUnits;
    console.log(`You've purchased the product!  There are now ${newStock} left for ID ${itemID}`);
    var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
    connection.query(query, [newStock, itemID], function(err, res) {
        // the console.log below is to check the results
        // console.log(res.affectedRows);  
    });
    connection.end();
}






