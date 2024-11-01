import { Selector } from 'testcafe';

fixture `Todo App Tests`
    .page `http://localhost:5173`
    .beforeEach(async t => {
        // Clear local storage before each test for a clean state
        await t.eval(() => localStorage.clear());
    });

test('Add two todos', async t => {
    const todoInput = Selector('#todo-input');

    await t
        .typeText(todoInput, 'Test Todo 1')
        .pressKey('enter'); // Submit the form by pressing Enter

    await t
        .typeText(todoInput, 'Test Todo 2')
        .pressKey('enter'); // Submit the form by pressing Enter

    const todoItem1 = Selector('.todo-item').withText('Test Todo 1');
    const todoItem2 = Selector('.todo-item').withText('Test Todo 2');

    await t
        .expect(todoItem1.exists).ok('Todo item 1 was not found after adding it.')
        .expect(todoItem2.exists).ok('Todo item 2 was not found after adding it.');
});


// Test to delete the first todo
test('Delete the first todo', async t => {
    const todoInput = Selector('#todo-input');

    // Add two todos to delete one
    await t
        .typeText(todoInput, 'Test Todo 1')
        .pressKey('enter'); // Submit the form by pressing Enter
    await t
        .typeText(todoInput, 'Test Todo 2')
        .pressKey('enter'); // Submit the form by pressing Enter

    const todoItem1 = Selector('.todo-item').withText('Test Todo 1');
    const deleteButton1 = todoItem1.find('.remove-btn');

    await t
        .expect(todoItem1.exists).ok('The first todo item to delete was not found.')
        .click(deleteButton1)
        .expect(todoItem1.exists).notOk('The first todo item was not removed after deletion.');
});
