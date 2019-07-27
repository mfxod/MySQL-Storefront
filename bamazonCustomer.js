// ===== PROCESS =====
// 1) establish connection
// 2) query and list products from db
// 3) show inquirer prompts
// 4) check if order can be fulfilled: if not log msg , else update db and show order cost
// 5) order another item?

// Note: The MySQL connection and Inquirer prompts each work fine in insolation, but the Inquirer bit breaks when run with the connection
// I think this is an async problem, but don't know how to fix it.



// ===== DEPENDENCIES =====
const mysql = require("mysql");
const inquirer = require("inquirer");



// ===== FUNCTIONS =====
// Note: I think it would be better to have stockQuantity() and fulfillOrder() declared up here somehow
function queryProducts() {
    connection.query("SELECT itemID, productName, price FROM products", function (err, res) {
        if (err) {
            throw err;
        } else {
            console.log("Hawkins Department Store Featured Items: \n");
            for (let i = 0; i < res.length; i++) {
                console.log(res[i].itemID + "\t" + res[i].productName + " \($" + res[i].price + "\)");
            }
        }
        connection.end();
    });
};



// ===== ESTABLISH CONNECTION AND SHOW PRODUCTS =====
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazondb"
});

connection.connect(function (err) {
    if (err) {
        throw err
    } else {
    queryProducts()
    }
});



// ===== INQUIRER PROMPTS =====
// Note: Comment out MySQL connection to test this:
inquirer
    .prompt([{
            type: "list",
            message: "Choose the itemID of the product you would like to buy.",
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            name: "itemID"
        },
        {
            type: "number",
            message: "Enter the number of units you would like to buy.",
            name: "unitsToBuy"
            // validate: function to check if input was an integer and log error msg if not
        },
    ])
    .then(function (order) {
        function stockQuantity() {
            connection.query("SELECT stockQuantity FROM products WHERE itemID =" + order.itemID, function (err, res) {
                if (err) {
                    throw err;
                } else {
                    // console.log(res[0].stockQuantity)
                    // Why does this return come back "undefined"?
                    return res[0].stockQuantity
                }
            })
        };

        if (stockQuantity() - order.unitsToBuy < 0) {
            console.log("There is not sufficient stock to fulfill the order at this time.")
        } else {
            function fulfillOrder() {
                connection.query("UPDATE products SET stockQuantity = " + stockQuantity() - answers.unitsToBuy +
                "WHERE itemID = " + answers.itemID, function (err, res) {
                    if (err) {
                        throw err;
                    } else {
                        console.log("Your total is: $" + res.price * order.unitsToBuy)
                    }
                    connection.end();
                });
            };
            fulfillOrder();
        }
    });