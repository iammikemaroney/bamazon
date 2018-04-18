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

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayProducts();
  });

  function menuOptions(){
    inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    })
    .then(function(data) {
        if (data.menu === "View Products for Sale"){
            displayProducts();
        }
        if (data.menu === "View Low Inventory"){
            displayLowInv();
        }
        if (data.menu === "Add to Inventory"){
            addInv();
        }
        if (data.menu === "Add New Product"){
            newProduct();
        }
    });
  }
  
  function displayProducts() {
    console.log("================================================");
    console.log("Products available for sale");
    console.log("================================================");  
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log();
    });
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity']
    });
    for (var i = 0; i < res.length; i++) {
        var productArr = [];
        for (var key in res[i]) {
            productArr.push(res[i][key]);
            // table is an Array, so you can `push`, `unshift`, `splice` and friends
        }
    }
    table.push(productArr);
    console.log(table.toString());
    connection.end();
}

function displayLowInv() {
    console.log("================================================");
    console.log("Low Inventory Products");
    console.log("================================================");  
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
      if (err) throw err;
      console.log();
    });
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity']
    });
    for (var i = 0; i < res.length; i++) {
        var productArr = [];
        for (var key in res[i]) {
            productArr.push(res[i][key]);
            // table is an Array, so you can `push`, `unshift`, `splice` and friends
        }
    }
    table.push(productArr);
    console.log(table.toString());
    connection.end();
}

function addInv() {
    inquirer
    .prompt([{
        name: "id",
        type: "input",
        message: "Select product for quantity update:"
    },
    {
        name: "quantity",
        type: "input",
        message: "Select quantity you would like to add:"
    }])
    .then(function(answer){
        var temp = "SELECT stock_quantity from products WHERE ?"
        var id = parseInt(answer.id);
        connection.query(temp, {item_id: id}, function(err, data){
            if (err) throw err;
                var newQuantity = data[0].stock_quantity + parseInt(answer.quantity);
                connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {item_id: id}], function(err, data){
                    if (err) throw err;
                })
            connection.end();
        });
    });
}


// add product:
// prompt for data 
// parse int for qtty and price
// insert query (add data into table)
