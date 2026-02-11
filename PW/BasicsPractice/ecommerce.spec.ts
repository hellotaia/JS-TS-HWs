import { test, expect } from '@playwright/test';

const baseURL = 'https://www.saucedemo.com'

test('should sort products and add an item to the cart', async ({ page }) => {
    //Navigate and Login:
    await page.goto(baseURL);
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    //Assert Successful Login:
    await expect(page).toHaveURL(baseURL + '/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');

    //Interact with the Product Filter:
    const sortSelect = page.locator('[data-test="product-sort-container"]');
    await sortSelect.selectOption('hilo');

    //Assert the Sort Order:
    const firstItem = page.locator('.inventory_item').first();
    await expect(firstItem).toContainText("Sauce Labs Fleece Jacket");
    const firstItemPrice = firstItem.locator('[data-test="inventory-item-price"]');
    await expect(firstItemPrice).toHaveText('$49.99');

    //Add Item to Cart:
    const itemCartButton = firstItem.locator('.btn');
    await expect(itemCartButton).toHaveText('Add to cart');
    await itemCartButton.click();

    //Assert Cart State:
    await expect(itemCartButton).toHaveText('Remove');
    const cartLink = page.locator('.shopping_cart_link');
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    //Navigate to and Verify the Cart:
    await cartLink.click();
    await expect(page).toHaveURL(baseURL + '/cart.html');
    await expect(page.locator('.title')).toHaveText('Your Cart');
    const cartItemTitle = page.locator('.cart_item .inventory_item_name');
    await expect(cartItemTitle).toHaveText('Sauce Labs Fleece Jacket');

    //Bonus Challenge
    const jacketItem = page
        .locator('.cart_item')
        .filter({ hasText: 'Sauce Labs Fleece Jacket' });
    const jacketButton = jacketItem.locator('.btn');
    await expect(jacketButton).toHaveText('Remove');
    await jacketButton.click();

    await expect(jacketItem).toHaveCount(0);
    await expect(cartBadge).toHaveCount(0);
});