
// ===== DEPENDENCIES =====

const mysql = require("mysql")
const inquirer = require("inquirer")
const cTable = require("console.table")

// ===== ESTABLISH CONNECTION =====

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

// ===== FUNCTIONS =====

// check if customer has entered "q" to exit and, if so, end the program
const exitCheck = choice => {
    if (choice.toLowerCase() === "q") {
        console.log("Thanks for stopping in. Goodbye.")
        process.exit(0)
    }
}

// check if the customer-provided value matches an itemID in the db 
// if so, return the corresponding product object, else return null
const checkInventory = (choiceId, inventory) => {
    // console.log("inventory: " + JSON.stringify(inventory))
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].itemID === choiceId) {
            return inventory[i]
        }
    }
    return null
}

// UPDATE db and log purchase message then restart the process
const makePurchase = (product, quantity) => {
    connection.query(
        "UPDATE products SET stockQuantity = stockQuantity - ? WHERE itemID = ?",
        [quantity, product.itemID],
        (err, res) => {
            if (err) {
                throw err
            } else {
                console.log(
                    "\nSuccessfully purchased " + quantity + " " + product.productName + 
                    "\nYour total is: $" + quantity * product.price
                )
                queryProducts()
            }
        })
}

// prompt customer to enter an order quantity, validate it and
// either make the purchase or re-prompt for a valid quantity
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
            exitCheck(val.quantity)
            const quantity = parseInt(val.quantity)

            if (product.stockQuantity > 0 && quantity > product.stockQuantity) {
                console.log(
                    "\nInsufficent quantity to fulfill order. Please try a lower quantity." + 
                    "\nCurrent stock: " + product.stockQuantity
                    )
                queryProducts()
            } else if (product.stockQuantity === 0) {
                console.log("\nWe're sorry, that item is temporarily out of stock.")
                queryProducts()
            } else {
                makePurchase(product, quantity)
            }
        })
}

// prompt customer to enter itemID and validate it
// if invalid, display appropriate message, otherwise promptForQuantity()
const promptForItem = inventory => {
    inquirer
        .prompt([{
            type: "input",
            name: "choice",
            message: "Enter ID of item to purchase. [To quit enter q.]",
            validate: val => {
                // console.log("\nval: " + val)
                return !isNaN(val) || val.toLowerCase() === "q"
            }
        }])
        .then( val => {
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

// ===== START PROCESS =====

// query db for products and display them for customer
const queryProducts = () => {
    connection.query("SELECT itemID, productName, price, stockQuantity FROM products", (err, res) => {
        if (err) {
            throw err
        } else {
            console.log("\nHawkins Department Store Featured Items: \n")
            console.table(res)
        }
        promptForItem(res)
    })
}