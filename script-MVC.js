// 1. Show how many active tasks left at the left of footer
// 2. Three tabs in center of footer to toggle between All, Active, Completed and show filtered tasks
// 3. Left header button to toggle all tasks. If any task is not completed, set all tasks to completed. If all tasks are completed, set all to active
// 4. Type in the input, press enter key to add the task (listen to "keyup" event)
// 5. Hover on task, shows pencil icon. Clicking pencil icon allows user to edit the task. Once editing is done, a checkmark icon allows user to save the editing
// 6. During editing, press enter key to save the task( listen to "keyup" event)
// 7. Close and reopen the application, it should keep all the previous tasks. // localStorage

// [{
//    id: 123142345,
//   value: "123",
//   checked: true
// }, {
//    id: 12321123142345,
//   value: "456",
//   checked: false
// }]

const tabs = {
  All: "ALL",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
};

const model = {
  todoList: [],
  activeTab: tabs.All,
  editingTodo: null
};

const getListContainer = () => document.querySelector(".list-container");

function createId(){
  return new Date().toISOString();
}

function addTodo() {
    console.log("I'm working!");
    const input = document.querySelector(".text-input");
    const value = input.value;
    if (value) {
      model.todoList.push({
        id: createId(),
        checked: false,
        value,
      });
      updateView();
      input.value = "";
    }
}

function clearAll(){
  model.todoList = [];
  updateView();
};

function removeTodo(id){
  const newList = model.todoList.filter(todo => todo.id !== id);
  model.todoList = newList;
  updateView();
};

function toggleTodo(id){
  const newList = model.todoList.map(todo => {
    if( todo.id === id){
      todo.checked = !todo.checked;
      return todo;
    }
    return todo;
  })
  model.todoList = newList;
  updateView();
}

function toggleEditing(id, isEditing, value){
  const newList = model.todoList.map(todo => {
    if (todo.id === id){
      if(value){
        todo.value = value;
      }
      return todo;
    }
    return todo;
  })
  model.todoList = newList;
  isEditing ? model.editingTodo = id : model.editingTodo = null;
  updateView();
}

function handleListClick(e){
  const el = e.target;
  if (el.classList.contains("delete-icon")){
    const li = el.parentNode;
    const id = li.getAttribute("data-id");
    removeTodo(id);
    return;
  }

  if (el.classList.contains("done-icon")){
    const li = el.parentNode;
    const id = li.getAttribute("data-id");
    const input = li.querySelector(".text-input");
    toggleEditing(id, false, input.value);
    return ;
  }
  
  if(el.classList.contains("edit-icon")){
    const li = el.parentNode;
    const id = li.getAttribute("data-id");
    toggleEditing(id, true);
    return;
  }
}

function handleTabClick(e) {
  const el = e.target;
  const tabName = el.getAttribute('name');
  model.activeTab = tabName;
  updateView();
}

function handleInputAreaKeyUp(e){
  if (e.key === 'Enter'){
    addTodo();
  }
}

function handleListContainerKeyUp(e){
  if(e.key === 'Enter'){
    if(model.editingTodo){
      const listContainer = document.querySelector(".list-container");
      const input = listContainer.querySelector(".text-input");
      toggleEditing(model.editingTodo, false, input.value);
    }
  }
}

function toggleAll(){
  const hasUnchecked = model.todoList.some(todo => !todo.checked);
  let newList;
  if (hasUnchecked){
    newList = model.todoList.map(todo => ({ ...todo, checked: true}));
  }else{
    newList = model.todoList.map(todo => ({ ...todo, checked: false}));
  }
  model.todoList = newList;
  updateView();
}

function getTodoListize() {
  let count = 0
  for(let i = 0; i < model.todoList.length; ++i){
    if(model.todoList[i].checked == false){
      count++;
    }
  }
  return count;
}

function loadEvents(){
  const addButton = document.querySelector("#addButton");
  const clearButton = document.querySelector("#clearButton");
  const checkAllButton = document.querySelector("#checkAllButton");
  const listContainer = document.querySelector(".list-container");
  //const tabListContainer = document.querySelector(".tab-list");
  const inputArea = document.querySelector(".input-area");

  addButton.addEventListener('click', addTodo);
  clearButton.addEventListener('click', clearAll);
  checkAllButton.addEventListener('click', toggleAll);
  listContainer.addEventListener('click', handleListClick);
  //tabListContainer.addEventListener('click', handleTabClick);
  listContainer.addEventListener('keyup', handleListContainerKeyUp);
  inputArea.addEventListener('keyup', handleInputAreaKeyUp);
}

function createTaskNode(value, id, checked, editingTodo) {
  const isEditing = editingTodo === id;
  const li = document.createElement("li");
  li.setAttribute("data-id", id);

  const text = document.createElement("span");
  text.innerHTML = value;

  const checkbox = document .createElement("input");
  checkbox.setAttribute("type", "checkbox");
  if(checked){
    checkbox.checked = checked;
    text.classList.add("checked");
  }

  let input
  if(isEditing){
    input = document.createElement("input");
    input.className = "text-input";
    input.value = value;
  }

  li.appendChild(checkbox);
  if(isEditing){
    li.appendChild(input);
    const doneIconDiv = document.createElement("div");
    doneIconDiv.classList.add("done-icon");
    doneIconDiv.innerHTML = "&#10003;";
    checkbox.disabled = true;
    li.appendChild(doneIconDiv);
  }else{
    li.appendChild(text);

  const deleteIconDiv = document.createElement("div");
  deleteIconDiv.classList.add("delete-icon");
  deleteIconDiv.innerHTML = "&#10005;";
  
  const editIconDiv = document.createElement("div");
  editIconDiv.classList.add("edit-icon");
  editIconDiv.innerHTML = "&#9998;";
  
  li.appendChild(editIconDiv);
  li.appendChild(deleteIconDiv);

  }
  return li;
}

function updateTaskList(){
  const listContainer = document.querySelector(".list-container");
  listContainer.innerHTML = "";

  model.todoList.filter((todo) => {
    if (model.activeTab === tabs.ALL){
      return true;
    }
    if (model.activeTab === tabs.ACTIVE){
      return !todo.checked;
    }
    if (model.activeTab === tabs.COMPLETED){
      return todo.checked;
    }
  }).forEach(todo =>{
    const li = createTaskNode(todo.value, todo.id, todo.checked, model.editingTodo);
    listContainer.appendChild(li);
  });
  const editingInput = listContainer.querySelector(".text-input");
  editingInput && editingInput.focus();
}

function updateCount(){
  const count = document.querySelector(".count");
  count.textContent = model.todoList.filter(todo => !todo.checked).length;
}

function updateTab(){
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab){
    const name = tab.getAttribute("name");
    if (name === model.activeTab){
      tab.className = "tab selected";
    }else{
      tab.classname = "tab";
    }
  })
}

function updateView() {
  updateTaskList();
  updateCount();
  updateTab();
  let todoCount = getTodoListize();
  console.log(todoCount);
  document.getElementById("strong").innerHTML = todoCount;
  localStorage.setItem("todoList", JSON.stringify(model.todoList));
};

function loadState(){
  const todoListStr = localStorage.getItem("todoList");
  if(todoListStr){
    model.todoList = JSON.parse(todoListStr);
  }
  updateView();
}

loadEvents();
loadState();