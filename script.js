const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;


// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listIdArrays = ['backlogItems', 'progressItems', 'onHoldItems', 'completeItems'];
let listArrays = {};

// Drag Functionality
let draggedItem;
let currentColumn;


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
    if (localStorage.getItem('backlogItems')) {
        backlogListArray = JSON.parse(localStorage.backlogItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
        onHoldListArray = JSON.parse(localStorage.onHoldItems);
    } else {
        backlogListArray = ['Release the course', 'Sit back and relax'];
        progressListArray = ['Work on projects', 'Listen to music'];
        completeListArray = ['Being cool', 'Getting stuff done'];
        onHoldListArray = ['Being uncool'];
    }
}

// Set localStorage Arrays
function updateSavedColumns() {

    listArrays['backlogItems'] = backlogListArray;
    listArrays['progressItems'] = progressListArray;
    listArrays['onHoldItems'] = onHoldListArray;
    listArrays['completeItems'] = completeListArray;

    for (const key in listArrays) {
        localStorage.setItem(`${key}`, JSON.stringify(listArrays[key]));
    }
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
    /*     console.log('columnEl:', columnEl);
        console.log('column:', column);
        console.log('item:', item);
        console.log('index:', index); */
    // List Item
    const listEl = document.createElement('li');
    listEl.classList.add('drag-item');
    listEl.textContent = item;
    listEl.draggable = true;
    listEl.setAttribute('ondragstart', 'drag(event)');
    //Append
    columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
    // Check localStorage once
    if (!updatedOnLoad) {
        getSavedColumns();
    }

    // Backlog Column
    backlogList.textContent = '';
    backlogListArray.forEach((backlogItem, index) => {
        createItemEl(backlogList, 0, backlogItem, index);
    });

    // Progress Column
    progressList.textContent = '';
    progressListArray.forEach((progressItem, index) => {
        createItemEl(progressList, 0, progressItem, index);
    });

    // Complete Column
    completeList.textContent = '';
    completeListArray.forEach((completeItem, index) => {
        createItemEl(completeList, 0, completeItem, index);
    });

    // On Hold Column
    onHoldList.textContent = '';
    onHoldListArray.forEach((onHoldItem, index) => {
        createItemEl(onHoldList, 0, onHoldItem, index);
    });

    // Run getSavedColumns only once, Update Local Storage
    updatedOnLoad = true;
    updateSavedColumns();
}

// Add to Column List, Rest Textbox
function addToColum(column) {
    const itemText = addItems[column].textContent;
    const selectedArray = listArrays[listIdArrays[column]];
    selectedArray.push(itemText);
    addItems[column].textContent = '';
    updateDOM();
}

// Show Add Item Input Box 
function showInputBox(e) {
    const column = e.parentNode.getAttribute('data-column-index');
    addBtns[column].style.visibility = 'hidden';
    saveItemBtns[column].style.display = 'flex';
    addItemContainers[column].style.display = 'flex';
}

// Hide Add Item Input Box 
function hideInputBox(e) {
    const column = parseInt(e.parentNode.getAttribute('data-column-index'));
    addBtns[column].style.visibility = 'visible';
    saveItemBtns[column].style.display = 'none';
    addItemContainers[column].style.display = 'none';
    addToColum(column);
}

// Allows arraays to reflect Drag and Drop items
function rebuildArrays() {
    //Reset Array
    backlogListArray = [];
    progressListArray = [];
    completeListArray = [];
    onHoldListArray = [];

    //Rebuild Array
    for (let i = 0; i < backlogList.children.length; i++) {
        backlogListArray.push(backlogList.children[i].textContent);
    }
    for (let i = 0; i < progressList.children.length; i++) {
        progressListArray.push(progressList.children[i].textContent);
    }
    for (let i = 0; i < completeList.children.length; i++) {
        completeListArray.push(completeList.children[i].textContent);
    }
    for (let i = 0; i < onHoldList.children.length; i++) {
        onHoldListArray.push(onHoldList.children[i].textContent);
    }
    updateDOM();
}

// When item starts draggin
function drag(e) {
    draggedItem = e.target;
}
// Column allows for Item to drop
function allowDrop(e) {
    e.preventDefault();
}
// Wheren item enters column area
function dragEnter(column) {
    listColumns[column].classList.add('over');
    currentColumn = column;
}
// Dropping item in column
function drop(e) {
    e.preventDefault();
    // remove background Color/Padding
    listColumns.forEach((column) => {
        column.classList.remove('over');
    });
    // Add item to  Column
    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);
    rebuildArrays();
}



// On Load
updateDOM();