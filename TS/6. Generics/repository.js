var Repository = /** @class */ (function () {
    function Repository() {
        this.items = [];
    }
    Repository.prototype.add = function (item) {
        this.items.push(item);
    };
    Repository.prototype.findAll = function () {
        return this.items;
    };
    Repository.prototype.findById = function (id) {
        return this.items.find(function (item) { return item.id === id; });
    };
    return Repository;
}());
var userRepository = new Repository();
var productRepository = new Repository();
userRepository.add({ id: 1, name: "Alice" });
productRepository.add({ id: "ID-One", title: "Laptop", price: 999.99 });
userRepository.findAll().forEach(function (user) {
    console.log("User ID: ".concat(user.id, ", Name: ").concat(user.name));
});
productRepository.findAll().forEach(function (product) {
    console.log("Product ID: ".concat(product.id, ", Title: ").concat(product.title, ", Price: $").concat(product.price));
});
console.log("Found user:", userRepository.findById(1));
console.log("Found product:", productRepository.findById("ID-One"));
