import { test, expect } from '@playwright/test';
import { TodoPage } from './TodoPage';


let todoPage: TodoPage;


test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();


    const count = await todoPage.todoItems.count();
    if (count === 0) return;
    await expect(todoPage.toggleAll).toBeVisible();
    await todoPage.toggleAll.setChecked(true);
    await expect(todoPage.clearCompleted).toBeVisible();
    await todoPage.clearCompleted.click();
    await expect(todoPage.todoItems).toHaveCount(0);
});

test('should allow a user to add and complete a to-do item', async ({ page }) => {
    await todoPage.addTodo('Create a POM');
    await todoPage.addTodo('Write a test');
    await todoPage.addTodo('Run the test');

    await expect(todoPage.itemCount).toHaveText('3');

    await todoPage.markAsComplete('Write a test');
    await expect(todoPage.todoItems.filter({ hasText: 'Write a test' })).toBeVisible();
    await expect(todoPage.todoItems.filter({ hasText: 'Write a test' })).toHaveClass(/completed/);
    await todoPage.completedFilter.click();


    await todoPage.filterBy('Active');
    await expect(todoPage.itemCount).toHaveText('2');
    await expect(todoPage.todoItems.filter({ hasText: 'Write a test' })).toBeHidden();
    await expect(todoPage.todoItems.filter({ hasText: 'Create a POM' })).toHaveText('Create a POM');
    await expect(todoPage.todoItems.filter({ hasText: 'Run the test' })).toHaveText('Run the test');

    await todoPage.filterBy('Completed');
    //await expect(todoPage.todoItems.filter({ hasText: 'Write a test' })).toBeVisible();
    await expect(todoPage.todoItems.filter({ hasText: 'Write a test' })).toHaveText('Write a test');
});

// test('should load the page with mocked to-do item', async ({ page }) => {
//     page.on('request', r => console.log(r.method(), r.url()))
//     await todoPage.setupMockTodos();
//     await todoPage.goto();
//     await expect(todoPage.itemCount).toHaveCount(2);
//     await expect(todoPage.itemCount.filter({ hasText: 'Mocked Task 2' }).locator('.todo-list li.completed')).toHaveText('Mocked Task 2');
// })

// test('should not add a to-do if the server returns an error', async ({ page }) => {
//     page.on('request', r => console.log(r.method(), r.url()))
//     await page.route('**/api/todos', route => route.fulfill({ status: 500 }));
//     await todoPage.addTodo('Create a POM');
//     await expect(todoPage.itemCount).toHaveCount(0);
// })
