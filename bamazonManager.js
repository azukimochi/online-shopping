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
    showMenu();
});

//function that shows a menu to the Manager upon opening the application 
function showMenu() {
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "What would you like to do with the inventory?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
            ]
        }). then(function(answer) {
            switch (answer.menu) {
                case "View Products for Sale":
                    readProducts();
                    break;
                case "View Low Inventory":
                    readLowInventory();
                    break;
                case "Add to Inventory": 
                    readProducts(answer.menu);
                    break;
                case "Add New Product":
                    addProduct();
            }
        });
}

//displays all the items for sale 
function readProducts(choice) {
    console.log("\nBelow are the products for sale:\n_______________________________\n")
    var productsArr = [];
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_id}|| Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}|| Stock: ${res[i].stock_quantity}\n`);
            productsArr.push(res[i].item_id);
        }
        // console.log(productsArr);
        console.log("_______________________________\n");
        isSelectID(choice, productsArr);
    });
}

// If the manager chooses to Add to Inventory, the items for sale will be displayed and selectID will run. Otherwise, they'll be prompted to choose to quit the program.
function isSelectID(choice, productsArr) {
    if (choice == "Add to Inventory") {
        selectID(productsArr);
    } else {
        quitOrNot();
    }
}

//function that shows the products with fewer than 5 units in stock 
function readLowInventory() {
    console.log("\nBelow are the products with fewer than 5 units in stock:\n_______________________________\n")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <5) {
                console.log(`ID: ${res[i].item_id}|| Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}|| Stock: ${res[i].stock_quantity}\n`);
            }
        }
        quitOrNot();
    });
}

//function that allows manager to select the specific item to add more units to
function selectID(productsArr) {
    inquirer
        .prompt({
            name: "id",
            type: "input",
            message: "Type in the ID of the product to which you want to add more units:",
            validate: function(answer) {
                return answer > 0;
            }
        }).then(function(answer) {
            var itemID = answer.id;
            if (productsArr.includes(parseInt(itemID)) === true) {
                printRequestedProduct(itemID);
            } else {
                console.log("\nThat ID doesn't exist. Please try again.\n");
                selectID(productsArr);
            }
        });
    }

// function that allows manager to print out the requested item they've selected the ID for
function printRequestedProduct(itemID) {
    var query = "SELECT * FROM products WHERE item_id=?";
    connection.query(query, [itemID], function (err, res, fields) {
        for (var i = 0; i < res.length; i++) {
            console.log(`\nYou selected ID ${itemID}. The item's information is below: \n`);
            console.log(`Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}|| Stock: ${res[i].stock_quantity}\n`);
            var currentStock = res[i].stock_quantity;
        }
        addInventory(itemID, currentStock);
    });
}

//function that asks the manager how many units of that specific product they'd like to add
function addInventory(itemID, currentStock) {
    inquirer
        .prompt({
            name: "units",
            type: "input",
            message: "Type in the number of units you want to add for this product:",
            validate: function(answer) {
                return answer > 0;
            }
        }).then(function(answer) {
            var requestedUnits = answer.units;
            var newStock = parseInt(currentStock) + Math.floor(requestedUnits);
            var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
            console.log(`\nThe item ID: ${itemID}`);
            console.log(`The current stock: ${currentStock}`);
            console.log(`Requested units: ${Math.floor(requestedUnits)}`);
            connection.query(query, [newStock, itemID], function(err, res) {
                // the console.log below is to check the results
                // console.log(res.affectedRows);  
            });
            console.log(`You've added ${Math.floor(requestedUnits)} more units! There are now ${newStock} in stock for ID ${itemID}\n`);
            quitOrNot();
        });
}

// function that asks manager to provide details for the new product they'd like to add
function addProduct() {
    inquirer
        .prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the product you want to add?"
        }, {
            name: "department",
            type: "list",
            message: "What is the department of this product?",
            choices: [
                "beauty",
                "electronics",
                "home",
                "office",
                "clothing",
                "toys & games",
                "sports & outdoors",
                "grocery"
            ]
        }, {
            name: "price",
            type: "input",
            message: "What is the price of this product?",
            validate: function(answer) {
                return answer > 0;
            }
        },{
            name: "stock",
            type: "input",
            message: "How many units do you want to stock up for this product?",
            validate: function(answer) {
                return answer > 0;
            }
        }
        ]).then(function(answer) {
            listNewProduct(answer);
        });
    }

//function that sets this new row of data into MySQL
function listNewProduct(answer) {
    connection.query("INSERT INTO products SET ?",
        {
            product_name: answer.name,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: Math.floor(answer.stock)
        }, function (err, res) {
            if (err) throw err;
        });
    console.log("\nThe product has been added into the inventory!\n")
    quitOrNot();
    }

//after completing one activity, this prompts the manager to go back to the menu or to quit the program
function quitOrNot() {
    inquirer
        .prompt({
            name: "end_choice",
            type: "list",
            message: "Would you like to do another activity or would you like to exit the application?",
            choices: ["I'm not done! Show me the menu!", "I want to exit this application."]
        }).then(function (answer) {
            if (answer.end_choice == "I'm not done! Show me the menu!") {
                showMenu();
            } else {
                console.log("\nGoodbye, come again!\n");
                connection.end();
            }

        });
}