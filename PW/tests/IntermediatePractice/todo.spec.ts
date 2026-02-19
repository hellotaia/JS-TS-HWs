import { test, expect } from '@playwright/test';
import { TodoPage } from './TodoPage';


let todoPage: TodoPage;


test.beforeEach(async ({ page, request }) => {

    todoPage = new TodoPage(page, request);
    await todoPage.clearTodos();
});

test('should allow a user to add and complete a to-do item', async ({ page }) => {
    await todoPage.goto();
    await todoPage.addTodo('Create a POM');
    await expect(todoPage.todoItems.filter({ hasText: 'Create a POM' }))
        .toHaveCount(1);
    await todoPage.addTodo('Write a test');
    await expect(todoPage.todoItems.filter({ hasText: 'Write a test' }))
        .toHaveCount(1);
    await todoPage.addTodo('Run the test');
    await expect(todoPage.todoItems.filter({ hasText: 'Run the test' }))
        .toHaveCount(1);

    await expect(todoPage.activeItemCount).toHaveText('3');
    await todoPage.markAsComplete('Write a test');
    await expect(todoPage.todoItems.filter({ hasText: 'Write a test' }))
        .toBeVisible();
    await expect(todoPage.todoItems.filter({ hasText: 'Write a test' }))
        .toHaveClass(/completed/);


    await todoPage.filterBy('Active');
    // await expect(page).toHaveURL(/#\/active/);
    await expect(todoPage.todoItems.filter({ hasText: 'Write a test' }))
        .toHaveClass('completed hidden');
    await expect(todoPage.todoItems.filter({ hasText: 'Create a POM' })).not
        .toHaveClass('completed hidden');
    await expect(todoPage.todoItems.filter({ hasText: 'Run the test' })).not
        .toHaveClass('completed hidden');


    await todoPage.filterBy('Completed');
    // await expect(page).toHaveURL(/#\/completed/);
    await expect(todoPage.todoItems.filter({ hasText: 'Write a test' }))
        .toHaveClass('completed');
    await expect(todoPage.todoItems.filter({ hasText: 'Create a POM' }))
        .toHaveClass('hidden');
    await expect(todoPage.todoItems.filter({ hasText: 'Run the test' }))
        .toHaveClass('hidden');
});

test('should load the page with mocked to-do item', async ({ page }) => {
    await todoPage.setupMockTodos();
    await todoPage.goto();
    await expect(todoPage.todoItems).toHaveCount(2);
    await expect(todoPage.todoItems.filter({ hasText: 'Mocked Task 2' }))
        .toHaveClass(/completed/);
    await expect(todoPage.todoItems).toContainText(
        ['Mocked Task 1', 'Mocked Task 2']
    );
})

test('should not add a to-do if the server returns an error', async ({ page }) => {
    await todoPage.serverMockError();
    await todoPage.goto();
    await todoPage.addTodo('This should fail');

    const response = await page.waitForResponse(
        response =>
            response.url() === todoPage.apiUrl
            && response.request().method() === 'POST'
    );
    expect(response.status()).toBe(500);

    await page.reload();
    await expect(todoPage.todoItems
        .filter({ hasText: 'This should fail' })).toHaveCount(0);
    await expect(todoPage.todoItems).toHaveCount(0);
})

