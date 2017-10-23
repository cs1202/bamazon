var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');

//sql connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "alinaanam123",
  database: "bamazon"
});

console.log("**********************************************************************************************************");
console.log("List a set of menu options:(1)View Products for SaleView(2)Low InventoryAdd to Inventory(3)Add New Product (4)Remove an existing");
console.log("");
console.log("***************************************************************************************");
console.log("                             BAMazon Manager  Portal                                 ");
console.log("***************************************************************************************");
console.log("");
//connect to mysql database and run the managerPrompt function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    managerPrompt();
});

//prompt the user to select what they would like to do and run a function accordingly
function managerPrompt(){
  inquirer.prompt([
    {
    name: 'choice',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View Products For Sale', 'View Low Inventory', 'Restock Inventory', 'Add New Product',"Remove An Existing Product", 'Exit']
    }
  ]).then(function(user){
    console.log(user.choice);
    switch(user.choice) {
          case 'View Products For Sale':
              viewProductsForSale(function(){
                managerPrompt();
              });
          break;

          case 'View Low Inventory':
              viewLowInventory(function(){
                managerPrompt();
              });
          break;

          case 'Restock Inventory':
              addToInventory();
          break;

          case 'Add New Product':
              addNewProduct();
          break;

          case 'Remove An Existing Product':
          removeRequest();
          break;

          case 'Exit':
              connection.end();
          break;
      }
    });
}

//function to print all items to the console, uses npm module cli-table
function viewProductsForSale(){
  //new cli-table
  var table = new Table({
    head: ['ID Number', 'Product', 'Department', 'Price', 'Quantity Available']
  });
  //get all rows from the Products table
  connection.query('SELECT * FROM Products', function(err, res){
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, '$' + res[i].Price.toFixed(2), res[i].StockQuantity]);
    }
    //log the table to the console
    console.log(table.toString());
    //callback the managerPrompt function to see if the user wants to do anything else
    
    });
}

//function to view all items where StockQuantity is less than 5
function viewLowInventory(){
  //query mysql database to get all rows where StockQuantity is less than 5
  connection.query('SELECT * FROM Products WHERE StockQuantity < 5',
  function(err, res){
    if(err) throw err;
    //if no items StockQuantity is less than 5 alert the user and run the callback function
    if (res.length === 0) {
      console.log('There are no items with low inventory.');
      //callback the managerPrompt function to see if the user wants to do anything else
      
    } else {
      //if some items do have StockQuantity less than 5 create a table to show those items
      var table = new Table({
        head: ['ID Number', 'Product', 'Department', 'Price', 'Quantity Available']
      });
      for (var i = 0; i < res.length; i++) {
        table.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, '$' + res[i].Price.toFixed(2), res[i].StockQuantity]);
      }
      //log the table to the console
      console.log(table.toString());
      console.log('These items are low on inventory.');
      //callback the managerPrompt function to see if the user wants to do anything else
      
    }
  });
}

function addToInventory() {
  connection.query('SELECT * FROM products', function(err, res) {
      if (err) throw err;

    var table = new Table({
      head: ["Product ID", "Product Name", "Department Name", "Price", "Quantity"],
      colWidths: [13, 20, 20, 13, 13],
    });
    
    for(var i = 0; i < res.length; i++) {
      table.push(
          [res[i].itemID, res[i].ProductName, res[i].DepartmentName, parseFloat(res[i].Price).toFixed(2), res[i].StockQuantity]
      );
    }
    
    
    inquirer.prompt([
    {
      type: "number",
      message: "Which product would you like to add to? (the Product ID)",
      name: "itemNumber"
    },
    {
      type: "number",
      message: "How many more would you like to add?",
      name: "howMany"
    },
    ]).then(function (user) {
      var newQuantity = parseInt(res[user.itemNumber - 1].StockQuantity) + parseInt(user.howMany);
      connection.query("UPDATE products SET ? WHERE ?", [{
          StockQuantity: newQuantity
        }, {
          itemID: user.itemNumber
        }], function(error, results) {
          if(error) throw error;

          console.log("\nYour quantity has been updated!\n");
          managerPrompt();
        });

    });
  });
}

//function to add a new product to the Products table
function addNewProduct(){
  var departments = [];
  //get all of the department names from Departments table
  connection.query('SELECT DepartmentName FROM Departments', function(err, res){
    if(err) throw err;
    for (var i = 0; i < res.length; i++) {
      departments.push(res[i].DepartmentName);
    }
  });
  //prompt the user for all of the information needed for the new product
  inquirer.prompt([
    {
    name: 'item',
    type: 'text',
    message: 'What is the product name of the item you would like to add?'
    },
    {
    name: 'department',
    type: 'list',
    message: 'Which department does this item belong to? If you need to add a department you will need an executive to do that.',
    choices: departments
    },
    {
    name: 'price',
    type: 'text',
    message: 'What is the price of this item?'
    },
    {
    name: 'stock',
    type: 'text',
    message: 'How many of this item do we have in stock currently?'
    }
  ]).then(function(user){
      //create an object with all of the items properties
      var item = {
        ProductName: user.item,
        DepartmentName: user.department,
        Price: user.price,
        StockQuantity: user.stock
      }
      //inset the new item into the mysql database
      connection.query('INSERT INTO Products SET ?', item,
      function(err){
        if(err) throw err;
        console.log(item.ProductName + ' has been successfully added to the inventory.');
        //run managerPrompt function again to see what the user would like to do
        managerPrompt();
      });
    });
}

function removeRequest(){
  inquirer.prompt([{
    name: "ID",
    type: "input",
    message: "What is the item number of the item you wish to remove?"
  }]).then(function(answer){
    var id = answer.ID;
    removeFromDatabase(id);
  });
};//end removeRequest

function removeFromDatabase(id){
  connection.query('DELETE FROM Products WHERE ItemID = ' + id);
  managerPrompt();
};//end 