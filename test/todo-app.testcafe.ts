import { Selector } from 'testcafe';

fixture`Todo App Tests`
    .page`https://live.sunguard.dk/todo/`
    .beforeEach(async t => {
        // Clear local storage before each test for a clean state
        await t.eval(() => localStorage.clear());
    });

test('Add two todos', async t => {
    const todoInput = Selector('#todo-input');

    await t
        .typeText(todoInput, 'Test Todo 1')
        .pressKey('enter') 
        .typeText(todoInput, 'Test Todo 2')
        .pressKey('enter');

    const todoItem1Text = Selector('.todo-item').withText('Test Todo 1').find('.todo-text');
    const todoItem2Text = Selector('.todo-item').withText('Test Todo 2').find('.todo-text');

    await t
        .expect(todoItem1Text.innerText).eql('Test Todo 1', 'First todo text does not match expected.')
        .expect(todoItem2Text.innerText).eql('Test Todo 2', 'Second todo text does not match expected.');
});

test('Delete the first todo', async t => {
    const todoInput = Selector('#todo-input');

    // Add two todos to delete one 2nd test
    await t
        .typeText(todoInput, 'Test Todo 1')
        .pressKey('enter')
        .typeText(todoInput, 'Test Todo 2')
        .pressKey('enter');

    const todoItem1 = Selector('.todo-item').withText('Test Todo 1');
    const deleteButton1 = todoItem1.find('.delete-btn');

    await t
        .expect(todoItem1.exists).ok('The first todo item to delete was not found.')
        .click(deleteButton1) 
        .expect(todoItem1.exists).notOk('The first todo item was not removed after deletion.');
});

// Test to mark a todo as completed
test('Mark a todo as completed', async t => {
    const todoInput = Selector('#todo-input');
    const todoText = 'Test Complete Todo';

   
    await t
        .typeText(todoInput, todoText)
        .pressKey('enter'); 

    // Step 2: Locate the todo item and completion checkbox
    const todoItem = Selector('.todo-item').withText(todoText);
    const completeCheckbox = todoItem.find('input[type="checkbox"]');

    // Step 3: Check if the checkbox exists
    await t.expect(completeCheckbox.exists).ok('Checkbox for todo item not found.');

    // Step 4: Mark the todo as completed
    await t
        .click(completeCheckbox)  // Click the checkbox to mark as completed
        .wait(100);  // Optional wait to allow UI update
});

// Test for toggling dark mode
test('Toggle dark mode', async t => {
    const darkModeToggle = Selector('#darkModeToggle');
    const mainContainer = Selector('body'); 

    await t.expect(darkModeToggle.exists).ok('Dark mode toggle button not found.');

    const initialBackgroundColor = await mainContainer.getStyleProperty('background-color');

    await t.click(darkModeToggle);

    const darkModeBackgroundColor = await mainContainer.getStyleProperty('background-color');
    await t
        .expect(darkModeBackgroundColor)
        .notEql(initialBackgroundColor, 'Background color did not change after toggling dark mode.');
});
