const mysql = require("mysql");
const inquirer = require("inquirer");

// ===== ESTABLISH CONNECTION AND SHOW PRODUCTS =====
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazondb"
});

function queryProducts() {
    connection.query("SELECT itemID, productName, price FROM products", function(err, res) {
        if (err) {
            throw err;
        } else {
            // console.log(res);
            console.log("Hawkins Department Store Featured Items: \n");
            for (let i = 0; i < res.length; i++) {
                console.log(res[i].itemID + "\t" + res[i].productName + "  \($" + res[i].price + "\)");
            }
        }
    });
};

connection.connect(function (err) {
    if (err) {
        throw err
    };
    console.log("Connected as id " + connection.threadId + "\n");
    queryProducts();
    connection.end();
});

//   ===== INQUIRER PROMPTS =====
// inquirer
//     .prompt([
//         {
//             type: "list",
//             message: "Enter the itemID of the product you would like to buy.",
//             choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//             name: "product"
//         },
//         {
//             type: "number",
//             message: "Enter the number of units you would like to buy.",
//             name: "quantity"
//         },
// ])
//     .then(function (inquirerRes) {
//         console.log(inquirerRes)
//     });