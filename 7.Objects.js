//7. Task: User and Shopping Cart Management
class User {
    constructor({ name, email }) {
        this.name = name;
        this.email = email;
    }

    getUserInfo() {
        return 'Name: ' + this.name + ', Email: ' + this.email;
    }
}

class ShoppingCart {
    constructor(user) {
        this.user = user;
        this.items = [];
    }
    addProduct(product) {
        // The product parameter will be an object (e.g., { name: 'Laptop', price: 1200 }). 
        // This method should add the product object to the items array.
        this.items.push(product);
    }
    getCartSummary() {
        return 'Shopping cart for ' + this.user.name + ' has ' + this.items.length + ' items.'
    }
}

//Demonstrate the functionality
const user = new User({
    name: 'Vasiliy',
    email: 'vasya@gmail.com',
})

const cart = new ShoppingCart(user)
cart.addProduct({ name: 'Laptop', price: 1200.00 })
cart.addProduct({ name: 'Phone', price: 555.12 })

console.log(user.getUserInfo(user));
console.log(cart.getCartSummary(cart));
