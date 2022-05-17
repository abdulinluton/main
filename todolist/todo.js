let myName = 'Abdul Razzak'
document.title = myName + ' todo App'

// Model section. Here data and data management pieces are put
// ************************* Model Start *************************
let todos = [{
  title: "Get Groceries",
  dueDate: '2021-04-20',
  id: 'id4',
  isDone: true
},
{
  title: "Wash car",
  dueDate: '2021-5-10',
  id: 'id5',
  isDone: false
},
{
  title: "Make dinner",
  dueDate: '2021-6-20',
  id: 'id6',
  isDone: true
}]

let todosFromLocalStorage = [];
let editButtonSet = [];
let deleteButtonSet = [];
let updateButtonSet = [];

const retrieveTodos = () => { // this supposed to be done to initialize only
  const todosText = localStorage.getItem("todos");

  if (!todosText) {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  else {
    todosFromLocalStorage = JSON.parse(todosText);
    // console.log(todosFromLocalStorage, todosText);
    todos = todosFromLocalStorage;
  }
}

function storeTodos() {
  localStorage.removeItem("todos");
  localStorage.setItem("todos", JSON.stringify(todos));
}


function createTodo(title, dueDate) {
  const today = new Date();
  const id = today.getMilliseconds();
  let isEditing = false;

  todos.push({
    title: title,
    dueDate: dueDate,
    id: id,
    isEditing: isEditing
  });
  storeTodos();
}

function removeTodo(idToDelete) {

  todos = todos.filter(list => {
    if (idToDelete == list.id) {
      return false
    }
    else {
      return true
    }
  })
  storeTodos();
}

function toggleTodo(taskId, checkedStatus) {
  todos.forEach(list => {
    if (list.id == taskId)
      list.isDone = checkedStatus;
  })
}

function toggleEditing(targetId) {
  todos.forEach(list => {
    if (list.id == targetId) {
      if (!list.isEditing) {
        list.isEditing = true;
      }
      else
        if (list.isEditing)
          list.isEditing = false;
        else
          list.isEditing = true;
    }
  })
  storeTodos();
  render();
  eventViewerObjects();
}

// *************** View start **************
retrieveTodos() // data initialization

function render() {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";
  editButtonSet.length = 0;
  deleteButtonSet.length = 0;
  updateButtonSet.length = 0;

  todos.forEach(list => {

    const element = document.createElement('div');
    if (list.isEditing) {
      // create a new text input for update
      const todoUpdateInput = document.createElement('input');
      todoUpdateInput.style = 'margin: 0 12px; width: 150px';
      todoUpdateInput.dataset.textInputId = list.id;
      todoUpdateInput.id = 'update-El' + list.id;
      element.appendChild(todoUpdateInput);

      const dateUpdate = document.createElement('input');
      dateUpdate.type = 'date';
      dateUpdate.dataset.dateInputId = list.id;
      dateUpdate.id = 'date-update-El' + list.id;
      element.appendChild(dateUpdate);

      const updateButton = document.createElement("button");
      updateButton.innerText = "Update";
      updateButton.style = 'padding: 5px 10px; margin-left: 12px';
      updateButton.dataset.updateId = list.id;
      updateButton.id = 'update-id' + list.id;
      updateButton.className = 'delete-btn';//to use the style
      // updateButton.setAttribute('onclick', 'updateTodoListItem(event)');
      element.appendChild(updateButton);
      updateButtonSet.push(updateButton.id);
    }
    else {

      element.innerText = list.title + ' ' + list.dueDate;

      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.className = 'chk-box';
      checkBox.id = "a" + list.id // this can be scrapped with dataset.todoId
      // checkBox.setAttribute('onChange', 'clickedOrNot(event)');
      checkBox.dataset.todoId = list.id;
      checkBox.checked = list.isDone;
      element.prepend(checkBox);

      const editButton = document.createElement("button");
      editButton.innerText = 'Edit';
      editButton.className = 'edit-btn';
      editButton.id = 'edit-btn' + list.id;
      editButton.dataset.taskId = list.id;
      // editButton.setAttribute('onclick', 'enableEditing(event)');
      element.appendChild(editButton);
      editButtonSet.push(editButton.id);

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.style = 'padding: 5px 10px; margin-left: 12px';
      deleteButton.id = 'del-id' + list.id;
      deleteButton.className = 'delete-btn';
      // deleteButton.setAttribute('onclick', 'deleteTodoListItem(event)');
      element.appendChild(deleteButton);
      deleteButtonSet.push(deleteButton.id);
    }
    todoList.appendChild(element);
  });
}

function eventViewerObjects() {
  for (let i = 0; i < editButtonSet.length; i++) {
    document.getElementById(editButtonSet[i]).addEventListener("click", enableEditing);
  }
  for (let i = 0; i < deleteButtonSet.length; i++) {
    document.getElementById(deleteButtonSet[i]).addEventListener("click", deleteTodoListItem);
  }
  for (let i = 0; i < updateButtonSet.length; i++) {
    document.getElementById(updateButtonSet[i]).addEventListener("click", updateTodoListItem);
  }
  const checkBoxSet = document.getElementsByClassName('chk-box');
  for (let i = 0; i < checkBoxSet.length; i++) {
    document.getElementById(checkBoxSet[i].id).addEventListener("change", clickedOrNot);
  }
}

render();
eventViewerObjects();


// *********** View End ****************

// Controller 

const addItemBtn = document.getElementById("add-item-btn");

addItemBtn.addEventListener("click", () => {
  const taskInput = document.getElementById("todo-title");
  const datePicker = document.getElementById("date-picker");
  if (taskInput.value != "") {
    createTodo(taskInput.value, datePicker.value);
    render();
    eventViewerObjects();
  }
});

function deleteTodoListItem(event) {
  let delBtnPressedId = (event.target.id).slice(6);

  removeTodo(delBtnPressedId);
  render();
  eventViewerObjects();
}
function clickedOrNot(event) {
  const checkBox = event.target;
  const taskId = checkBox.dataset.todoId;
  const checkedStatus = checkBox.checked;

  toggleTodo(taskId, checkedStatus);
}

function updateTodoListItem(event) {
  const targetEl = event.target;
  const updateId = targetEl.dataset.updateId;
  const updateEl = document.getElementById("update-El" + updateId);
  const dateUpdateEl = document.getElementById("date-update-El" + updateId);

  todos.forEach(list => {
    if (list.id == updateId) {
      list.dueDate = dateUpdateEl.value;
      list.title = updateEl.value;
      list.isEditing = false;
    }
  });
  storeTodos();
  render();
  eventViewerObjects();
}

function enableEditing(event) {
  const targetTodo = event.target;
  const targetId = targetTodo.dataset.taskId;

  toggleEditing(targetId)
}