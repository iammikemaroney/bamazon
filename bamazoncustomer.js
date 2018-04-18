var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    displayProducts();
});

function displayProducts() {
    console.log("==================================================");
    console.log("Welcome. Here are the products available for sale:");
    console.log("==================================================");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var itemArray = [];
        for (let i = 0; i < res.length; i++) {
            itemArray.push(res[i].product_name)
    }

    inquirer
        .prompt([{
            name: "id",
            type: "list",
            message: "What are you looking to buy?",
            choices: itemArray
        },
        {
            name: "quantity",
            type: "input",
            message: "How many products would you like to buy?"
        }])
        .then(function (answer) {
            var temp = "SELECT stock_quantity, price from products WHERE item_id = ?"
            var id = answer.id;

            var chosenItem;
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === answer.id) {
                    chosenItem = res[i];
                }
            }

            connection.query(temp, chosenItem.item_id, function (err, data1) {
                // console.log(data1);
                if (err) throw err;
                if (data1[0].stock_quantity >= parseInt(answer.quantity)) {
                    var newQuantity = data1[0].stock_quantity - parseInt(answer.quantity);
                    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newQuantity }, { item_id: chosenItem.item_id }], function (err, data2) {
                        if (err) throw err;
                        var price = data1[0].price * parseInt(answer.quantity);
                        console.log("Total Price = $" + price);
                        console.log("New Quantity = " + newQuantity)
                        console.log("Thank you for your purchase.")
                        console.log("==================================================")
                        console.log("==================================================")
                        displayProducts();
                    })
                }
                else {
                    console.log("Insufficient quantity!");
                }
            });
        })
    });
}
