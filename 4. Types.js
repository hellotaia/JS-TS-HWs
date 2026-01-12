//4.E-commerce Product Profile

//Product Name: The name of the product
const productName = "Wireless Headphones"; 

//Price: The selling price of the product
const productPrice = 1.99; 

//Is in Stock: A flag indicating if the product is available for purchase
//Declare a const variable for the stock status
const isInStock = false; 

//Promotional Discount: The discount percentage. 
// If there is no promotion, this should be explicitly set to nothing.
//Declare a const variable for the promotional discount to represent the absence of a promotion
const promoDiscount = null; 

//Last Ordered By: The name of the last customer to order. 
// If it has never been ordered, this should be left unassigned
//Declare a const variable for the last customer to order and leave it unassigned
const lastOrderedBy = undefined;

//Product Details: A simple object containing the product's category and SKU (Stock Keeping Unit).
const productDetails = {
category: "category1",
sku: "SKU",
};

//Product Summary: A descriptive, multi-line string that combines the product's name, price, and stock status.
const productSummary = `Product Name: ${productName}
Price: $${productPrice}
In Stock: ${isInStock}
Discount: ${promoDiscount}
Last ordered by: ${lastOrderedBy}`;
