const createTodoNode = (text) => {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  const span = document.createElement("span");
  span.innerHTML = text;
  const deleteDiv = document.createElement("div");

  deleteDiv.className = "delete-icon";
  deleteDiv.innerHTML = "&#10005;";

  // deleteDiv.addEventListener("click", () => {
  //   console.log("click on deleteDiv");
  //   const listContainer = getListContainer();
  //   listContainer.removeChild(li);
  // });
  // checkbox.addEventListener("click", () => {
  //   span.classList.toggle("checked");
  // });

  li.append(checkbox);
  li.append(span);
  li.append(deleteDiv);
  return li;
};

const getListContainer = () => document.querySelector(".list-container");

const handleAddTodo = (e) => {
  const input = document.querySelector(".text-input");
  const listContainer = getListContainer();
  const inputValue = input.value;
  const todoNode = createTodoNode(inputValue);
  listContainer.append(todoNode);
  input.value = "";
};

const handleClearAll = () => {
  const listContainer = getListContainer();
  listContainer.innerHTML = "";
  // for (let i = 0; i < listContainer.children.length; i++) {
  //   const child = listContainer.children[i];
  //   listContainer.remove(child);
  // }
};

const handleDelete = (deleteElement) => {
  const li = deleteElement.parentNode;
  const listContainer = getListContainer();
  listContainer.removeChild(li);
};

const handleToggleCheckbox = (checkboxEle) => {
  // checkboxEle.nextSibling.classList.toggle("checked");
  const li = checkboxEle.parentNode;
  const span = li.querySelector("span");
  span.classList.toggle("checked");
};

const handleListContainerClick = (e) => {
  if (e.target.classList.contains("delete-icon")) {
    handleDelete(e.target);
  } else if (e.target.tagName === "INPUT") {
    handleToggleCheckbox(e.target);
  }
};

const loadEvents = () => {
  const addButton = document.querySelector("#addButton");
  const clearButton = document.querySelector("#clearButton");
  const listContainer = getListContainer();

  addButton.addEventListener("click", handleAddTodo);
  clearButton.addEventListener("click", handleClearAll);

  listContainer.addEventListener("click", handleListContainerClick);
};

loadEvents();
