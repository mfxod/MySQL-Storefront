
// ===== DEPENDENCIES =====

const mysql = require("mysql")
const inquirer = require("inquirer")
const cTable = require("console.table")

// ===== FUNCTIONS =====

const exitCheck = choice => {
    if (choice.toLowerCase() === "q") {
        console.log("Thanks for stopping in. Goodbye.")
        process.exit(0)
    }
}

const checkInventory = (choiceId, inventory) => {
    // console.log("inventory: " + JSON.stringify(inventory))
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].itemID === choiceId) {
            return inventory[i]
        }
    }
    return null
}

const promptForQuantity = product => {
    inquirer
        .prompt([{
            type: "input",
            name: "quantity",
            message: "Enter quantity to purchase. [To quit enter q.]",
            validate: val => {
                return val > 0 || val.toLowerCase() === "q";
            }
        }]).then( val => {
            // console.log("val.quantity: " + val.quantity)
            exitCheck(val.quantity)
            const quantity = parseInt(val.quantity)

            // console.log("product.stockQuantity: " + product.stockQuantity)
            if (quantity > product.stockQuantity) {
                console.log("\nInsufficent quantity. Please try a new order.")
                queryProducts()
            } else {
                makePurchase(product, quantity)
            }
        })
}

const makePurchase = (product, quantity) => {
    connection.query(
        "UPDATE products SET stockQuantity = stockQuantity - ? WHERE itemID = ?",
        [quantity, product.itemID],
        (err, res) => {
            if (err) {
                throw err
            } else {
                console.log("\nSuccessfully purchased " + quantity + " " + product.productName)
                queryProducts()
            }
        })
}

const promptForItem = inventory => {
    inquirer
        .prompt([{
            type: "input",
            name: "choice",
            message: "Enter ID of item to purchase. [To quit enter q.]",
            validate: val => {
                // console.log("\nval: " + val)
                // console.log("\nval.choice 1: " + val.choice)
                return !isNaN(val) || val.toLowerCase() === "q"
            }
        }])
        .then( val => {
            // console.log("\nval.choice 2: " + val.choice)
            exitCheck(val.choice)
            const choiceId = parseInt(val.choice)
            const product = checkInventory(choiceId, inventory)

            if (product) {
                promptForQuantity(product)
            } else {
                console.log("\n Invalid item ID. Please choose again.")
                queryProducts()
            }
        })
}

// ===== ESTABLISH CONNECTION AND SHOW PRODUCTS =====

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazondb"
});

connection.connect( err => {
    if (err) {
        throw err
    } else {
        queryProducts()
    }
});

// ===== START PROCESS =====

const queryProducts = () => {
    connection.query("SELECT itemID, productName, price, stockQuantity FROM products", (err, res) => {
        if (err) {
            throw err
        } else {
            console.log("\nHawkins Department Store Featured Items: \n")
            console.table(res)
        }
        // console.log("res: " + JSON.stringify(res))
        promptForItem(res)
    })
}