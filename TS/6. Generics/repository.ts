interface Storable{
    id: string|number;
}
class Repository<T extends Storable> {
    private items: T[] = [];
    add(item: T): void {
        this.items.push(item);
    }
    findAll(): T[] {
        return this.items;
    }
    findById(id: string | number): T | undefined {
        return this.items.find(item => item.id === id);
    }
}
    interface User extends Storable {
        id: number;
        name: string;
    }
    interface Product extends Storable {
        id: string;
        title: string;
        price: number;
    }

const userRepository = new Repository<User>();
const productRepository = new Repository<Product>();

userRepository.add({ id: 1, name: "Alice" });
productRepository.add({ id: "ID-One", title: "Laptop", price: 999.99 });

userRepository.findAll().forEach(user => {
    console.log(`User ID: ${user.id}, Name: ${user.name}`);});
productRepository.findAll().forEach(product => {
    console.log(`Product ID: ${product.id}, Title: ${product.title}, Price: $${product.price}`);});


console.log("Found user:", userRepository.findById(1));
console.log("Found product:", productRepository.findById("ID-One"));
