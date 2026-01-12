// 5. Functions/ Product Data Formatter
const product = {
    name: 'Quantum Headphones',
    price: 149.99,
    getFormattedPrice() {
        return `$${this.price}`;
    }
};

const createProductLabel = (product) =>
    `Product: ${product.name} | Price: ${product.getFormattedPrice()}`;

console.log(createProductLabel(product));
