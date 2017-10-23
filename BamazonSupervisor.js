//node modules
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
console.log("List a set of menu options:(1)View Product Sales by Department(2)Create New Department");
console.log("");
console.log("***************************************************************************************");
console.log("                             BAMazon Supervisor  Portal                                 ");
console.log("***************************************************************************************");
console.log("");




//connect to mysql and run executivePrompt function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    executivePrompt();
});

//prompt the user to see what they would like to do
function executivePrompt(){
  inquirer.prompt([
  {
    name: 'choice',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View Product Sales By Department', 'Add A Department', 'Exit']
  }
  ]).then(function(user){
    //if user selects view product sales by department run the corresponding function
    if (user.choice === 'View Product Sales By Department') {
      viewProductSalesByDepartment();
    } else if(user.choice === 'Add A Department'){
      //if user selects add a department run the corresponding function
      addDepartment();
    } else if (user.choice === 'Exit') {
      connection.end();
    }
  });
}

function viewProductSalesByDepartment(){
  //new cli-table
  var table = new Table({
    head: ['ID Number', 'Department', 'Overhead Costs', 'Total Sales', 'Total Profit']
  });
  //get all the rows from the departments table
  connection.query('SELECT * FROM Departments', function(err, res){
    if(err) throw err;
    //add all of the rows to the cli-table
    for (var i = 0; i < res.length; i++) {
      var id = res[i].DepartmentID;
      var department = res[i].DepartmentName;
      var overhead = res[i].OverHeadCosts;
      overhead = overhead.toFixed(2);
      var totalSales = res[i].TotalSales;
      totalSales = totalSales.toFixed(2);
      var TotalProfit = totalSales - overhead;
      TotalProfit = TotalProfit.toFixed(2);
      table.push([id, department, '$' + overhead, '$' + totalSales, '$' + TotalProfit]);
    }
    //log the table to the console
    console.log(table.toString());
    //run executivePrompt function to see what the user would like to do
    executivePrompt();
  });
}

function addDepartment(){
  //prompt the user for all of the information needed for the new department
  inquirer.prompt([
    {
    name: 'name',
    type: 'text',
    message: 'What is the name of the department you would like to add?'
    },
    {
    name: 'overhead',
    type: 'text',
    message: 'What is the overhead for the department you would like to add?',
    //validate that the input is a number
    validate: function(str){
        if (isNaN(parseInt(str))) {
          console.log('\nOops. That\'s not a valid number!');
          return false;
        } else {
          return true;
        }
      }
    }
  ]).then(function(user){
      //create an object with all of the department properties
      var OverHeadCosts = parseInt(user.overhead);
      var department = {
        DepartmentName: user.name,
        OverHeadCosts: OverHeadCosts,
        TotalSales: 0
      }
      //insert the new department into the mysql database
      connection.query('INSERT INTO Departments SET ?', department,
      function(err){
        if(err) throw err;
        console.log(department.DepartmentName + ' has been successfully added to the departments table.');
        //run executivePrompt function again to see what the user would like to do
        executivePrompt();
      });
    });
}