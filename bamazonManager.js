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
    showMenu();
});

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

function readProducts(a) {
    console.log("\nBelow are the products for sale:\n_______________________________\n")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_id}|| Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}|| Stock: ${res[i].stock_quantity}\n`);
        }
        console.log("_______________________________\n");
        if (a == "Add to Inventory") {
            selectID();
        }
    });
}

function readLowInventory() {
    console.log("\nBelow are the products with 5 or less units:\n_______________________________\n")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <=5) {
                console.log(`ID: ${res[i].item_id}|| Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}|| Stock: ${res[i].stock_quantity}\n`);
            }
        }
        console.log("_______________________________\n")
    });
}

function selectID() {
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
            var query = "SELECT * FROM products WHERE item_id=?";
            connection.query(query, [itemID], function(err, res, fields) {
                for (var i = 0; i < res.length; i++) {
                    console.log(`\nYou selected ID ${itemID}. The item's information is below: \n`);
                    console.log(`Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}|| Stock: ${res[i].stock_quantity}\n`);
                    var currentStock = res[i].stock_quantity;
                } 
                addInventory(itemID, currentStock);
            });
        });
}

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
            console.log("The item: " + itemID);
            console.log("The current stock: " + currentStock);
            console.log("Requested units: " + Math.floor(requestedUnits));
            var newStock = parseInt(currentStock) + Math.floor(requestedUnits);
            var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
            connection.query(query, [newStock, itemID], function(err, res) {
                // the console.log below is to check the results
                // console.log(res.affectedRows);  
            });
            console.log(`You've added ${Math.floor(requestedUnits)} more units! There are now ${newStock} in stock for ID ${itemID}`);
        });
}

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
            console.log("\nBelow are the details of the new product:")
            console.log(`\nName: ${answer.name}`);
            console.log(`\nDepartment: ${answer.department}`);
            console.log(`\nPrice: $${answer.price}`);
            console.log(`\nStock Quantity: ${(answer.stock)}`);
            connection.query("INSERT INTO products SET ?", 
            {
                product_name: answer.name,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: Math.floor(answer.stock)
            }, function(err, res) {
                if (err) throw err;
                console.log("The product has been added into the inventory!")
            }
        );
        });
}

// function selectID() {
//     inquirer
//         .prompt({
//             name: "id",
//             type: "input",
//             message: "Type in the ID of the product you would like to purchase:"
//         }).then(function(answer) {
//             var itemID = answer.id;
//             var query = "SELECT * FROM products WHERE item_id=?";
//             connection.query(query, [itemID], function(err, res, fields) {
//                 for (var i = 0; i < res.length; i++) {
//                     console.log(`You selected ID ${itemID}. The item's information is below: \n`);
//                     console.log(`Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}\n`);
//                     var availableStock = res[i].stock_quantity;
//                 } 
//                 requestPurchase(itemID, availableStock);
//             });
//         });
// }
