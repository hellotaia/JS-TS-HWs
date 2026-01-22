// 5. Functions/ Product Data Formatter
const product = {
    name: 'Quantum Headphones',
    price: 149.99,
    getFormattedPrice() {
        return `$${this.price}`;
    }
};


//UPD with destruct
const createProductLabel = ({ name, getFormattedPrice }) => //product -> to { name, getFormattedPrice }
    `Product: ${name} | Price: ${getFormattedPrice.call(product)}`;

console.log(createProductLabel(product));
