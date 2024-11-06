import { Selector } from 'testcafe';

fixture`Todo App Tests`
    .page`http://localhost:5173`
    .beforeEach(async t => {
        // Clear local storage before each test for a clean state
        await t.eval(() => localStorage.clear());
    });

test('Add two todos', async t => {
    const todoInput = Selector('#todo-input');

    await t
        .typeText(todoInput, 'Test Todo 1')
        .pressKey('enter') // Submit the form by pressing Enter
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

    // Add two todos to delete one
    await t
        .typeText(todoInput, 'Test Todo 1')
        .pressKey('enter')
        .typeText(todoInput, 'Test Todo 2')
        .pressKey('enter');

    const todoItem1 = Selector('.todo-item').withText('Test Todo 1');
    const deleteButton1 = todoItem1.find('.delete-btn');

    await t
        .expect(todoItem1.exists).ok('The first todo item to delete was not found.')
        .click(deleteButton1) // Delete the first todo
        .expect(todoItem1.exists).notOk('The first todo item was not removed after deletion.');
});

// Test to mark a todo as completed
test('Mark a todo as completed', async t => {
    const todoInput = Selector('#todo-input');
    const todoText = 'Test Complete Todo';

    // Step 1: Add a todo item
    await t
        .typeText(todoInput, todoText)
        .pressKey('enter'); // Submit the form by pressing Enter

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
    // Selectors for the dark mode toggle button and the main container (or body) to check color change
    const darkModeToggle = Selector('#darkModeToggle');
    const mainContainer = Selector('body'); // Assuming body background color changes in dark mode

    // Check that the toggle button is present
    await t.expect(darkModeToggle.exists).ok('Dark mode toggle button not found.');

    // Store the initial background color of the main container for comparison
    const initialBackgroundColor = await mainContainer.getStyleProperty('background-color');

    // Click the toggle button to enable dark mode
    await t.click(darkModeToggle);

    // Verify that the background color of the main container has changed
    const darkModeBackgroundColor = await mainContainer.getStyleProperty('background-color');
    await t
        .expect(darkModeBackgroundColor)
        .notEql(initialBackgroundColor, 'Background color did not change after toggling dark mode.');
});
