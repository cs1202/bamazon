CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE Products (
	`ItemID` INTEGER (11) NOT NULL AUTO_INCREMENT,
	`ProductName` VARCHAR (100) NOT NULL,
	`DepartmentName` VARCHAR(50) NOT NULL,
	`Price` DECIMAL (10, 2) NOT NULL,
	`StockQuantity` INTEGER (11) NOT NULL,
	PRIMARY KEY (`ItemID`)
);


CREATE TABLE Departments (
    DepartmentID INTEGER(11) AUTO_INCREMENT NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    OverHeadCosts FLOAT(7, 2) NOT NULL,
    TotalSales FLOAT(7, 2) NOT NULL,
    PRIMARY KEY (DepartmentID)
);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Laptops', 2000, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Books Programming', 300, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Books ComputerScience', 400, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Books Network and Cloud Computing', 300, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Movies and Tv', 100, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Grocery', 100, 0);