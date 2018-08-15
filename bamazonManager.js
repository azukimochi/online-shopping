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
                    console.log("I'm viewing low inventory");
                    break;
                case "Add to Inventory": 
                    console.log("I want to add more stock");
                    break;
                case "Add New Product":
                    console.log("I want to add a new product");

            }
        });
}

function readProducts() {
    console.log("\nBelow are the products for sale:\n")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_id}|| Product: ${res[i].product_name}|| Department: ${res[i].department_name}|| Price: $${res[i].price}|| Stock: ${res[i].stock_quantity}\n`);
        }
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
