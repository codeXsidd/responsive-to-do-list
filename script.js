//add an eventListener to the from
const form = document.querySelector('#itemForm'); // select form
const itemInput = document.querySelector('#itemInput'); // select input box from form
const itemList = document.querySelector('.item-list');
const feedback = document.querySelector('.feedback');
const clearButton = document.querySelector('#clear-list');
const submitButton = document.querySelector('#itemForm button[type="submit"]'); // select submit button

let todoItems = [];
let editingItem = null; // track which item is being edited

const showFeedback = function(message, type) {
    feedback.innerHTML = message;
    feedback.classList.remove('alert-success', 'alert-danger');
    feedback.classList.add('showItem', `alert-${type}`);
    setTimeout(function() {
        feedback.classList.remove('showItem');
    }, 3000);
}

const resetForm = function() {
    editingItem = null;
    submitButton.textContent = 'add item';
    itemInput.placeholder = 'name...';
}

const handleItem = function(itemName) {
    const items = itemList.querySelectorAll('.item');
 
    items.forEach(function(item) {
        if(item.querySelector('.item-name').textContent === itemName) {
            //complete event listener
            item.querySelector('.complete-item').addEventListener('click', function() {
                item.querySelector('.item-name').classList.toggle('completed');
                this.classList.toggle('visibility');
            });
            
            //edit event listener
            item.querySelector('.edit-item').addEventListener('click', function() {
                editingItem = itemName;
                itemInput.value = itemName;
                itemInput.placeholder = 'update item name...';
                submitButton.textContent = 'update item';
                itemInput.focus();
            });
            
            // delete event listener
            item.querySelector('.delete-item').addEventListener('click', function() {
                itemList.removeChild(item);
                todoItems = todoItems.filter(function(item) {
                    return item !== itemName;
                });
                setLocalStorage(todoItems);
                showFeedback('item deleted', 'success');
                
                // Reset form if we're deleting the item being edited
                if (editingItem === itemName) {
                    resetForm();
                }
            })
        }
    })
}

const removeItem = function(item) {
    console.log(item);
    const removeIndex = (todoItems.indexOf(item));
    console.log(removeIndex);
    todoItems.splice(removeIndex, 1);
}

const getList = function(todoItems) {
    itemList.innerHTML = '';

    todoItems.forEach(function(item) {
        itemList.insertAdjacentHTML('beforeend', `<div class="item my-3"><h5 class="item-name text-capitalize">${item}</h5><div class="item-icons"><a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a><a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a><a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a></div></div>`);
        handleItem(item);
    });
}

const getLocalStorage = function() {
    const todoStorage = localStorage.getItem('todoItems');
    if (todoStorage === 'undefined' || todoStorage === null) {
        todoItems = [];
    } else {
        todoItems = JSON.parse(todoStorage);
        getList(todoItems);
    }
}

const setLocalStorage = function(todoItems) {
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

// get local storage from page
getLocalStorage();

//add an item to the List, including to local storage
form.addEventListener('submit', function(e) { 
    e.preventDefault();
    const itemName = itemInput.value.trim();
    
    if (itemName.length === 0) {
        showFeedback('Please Enter Valid Value', 'danger');
    } else if (editingItem) {
        // Update existing item
        const itemIndex = todoItems.indexOf(editingItem);
        if (itemIndex !== -1) {
            // Check if the new name already exists (and it's not the same item)
            if (todoItems.includes(itemName) && itemName !== editingItem) {
                showFeedback('Item already exists', 'danger');
                return;
            }
            
            todoItems[itemIndex] = itemName;
            setLocalStorage(todoItems);
            getList(todoItems);
            resetForm();
            showFeedback('item updated', 'success');
        }
    } else {
        // Add new item
        if (todoItems.includes(itemName)) {
            showFeedback('Item already exists', 'danger');
            return;
        }
        
        todoItems.push(itemName);
        setLocalStorage(todoItems);
        getList(todoItems);
        showFeedback('item added', 'success');
    }
    
    itemInput.value = '';
});

//clear all items from the list
clearButton.addEventListener('click', function() {
    todoItems = [];
    localStorage.clear();
    getList(todoItems);
    resetForm();
    showFeedback('all items cleared', 'success');
});

// Add escape key functionality to cancel edit
itemInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && editingItem) {
        resetForm();
        itemInput.value = '';
        showFeedback('edit cancelled', 'success');
    }
});