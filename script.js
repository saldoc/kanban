const addBtns = document.querySelectorAll(".add-btn:not(.solid):not(.cancel)");
const saveItemBtns = document.querySelectorAll(".solid");
const cancelBtns = document.querySelectorAll(".cancel");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

getSavedColumns();
updateSavedColumns();

// Set localStorage Arrays
function updateSavedColumns() {
  listArray = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = [
    "backlogItems",
    "progressItems",
    "completeItems",
    "onHoldItems",
  ];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(arrayName, JSON.stringify(listArray[index]));
  });
}

//filter for remove null items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null)
  return filteredArray
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.setAttribute("contenteditable", "true")
  listEl.id = index
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`)
  //append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((item, index) => {
    createItemEl(backlogList, 0, item, index);
  });
  backlogListArray = filterArray(backlogListArray)
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((item, index) => {
    createItemEl(progressList, 1, item, index);
  });
  progressListArray = filterArray(progressListArray)
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((item, index) => {
    createItemEl(completeList, 2, item, index);
  });
  completeListArray = filterArray(completeListArray)
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((item, index) => {
    createItemEl(onHoldList, 3, item, index);
  });
  onHoldListArray = filterArray(onHoldListArray)
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

function updateItem(id, col) {
  const selectedArray = listArray[col];
  const selectedColumnEl = listColumns[col].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
  updateDOM();
}

function addToColumn(col) {
  hideInputBox(col)
  const itemText = addItems[col].textContent;
  const selectedArray = listArray[col];
  selectedArray.push(itemText);
  addItems[col].textContent = "";
  updateDOM();
}

function showInputBox(col) {
  for (let i = 0; i < 4; i++) {
    if (col == i) {
      addBtns[col].style.display = "none";
      saveItemBtns[col].style.display = "flex";
      cancelBtns[col].style.display = "flex";
      addItemContainers[col].style.display = "flex";
    } else {
      hideInputBox(i)
    }
  }
}

function cancelInputBox(col) {
  hideInputBox(col)
  addItems[col].textContent = "";
}

function hideInputBox(col) {
  addBtns[col].style.display = "flex";
  saveItemBtns[col].style.display = "none";
  cancelBtns[col].style.display = "none";
  addItemContainers[col].style.display = "none";
}

//when item start drag
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  //remove over class
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

function dragEnter(col) {
  listColumns[col].classList.add("over");
  currentColumn = col;
}

//on load
updateDOM();