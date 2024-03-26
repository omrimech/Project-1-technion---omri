let users;
let posts;
let todos;
const usersPage = "https://jsonplaceholder.typicode.com/users";
const postsPage = "https://jsonplaceholder.typicode.com/posts";
const todosPage = "https://jsonplaceholder.typicode.com/todos";
let totalUsers

async function loadUsers() {
  const resp = await fetch(usersPage);
  users = await resp.json();
  totalUsers = users.length
  console.log(users);
  console.log(totalUsers);
  loadPosts();
}
async function loadPosts() {
  const resp = await fetch(postsPage);
  posts = await resp.json();
  loadTodos();
}
async function loadTodos() {
  const resp = await fetch(todosPage);
  todos = await resp.json();
  searchData();
}

// Create a div with a user
function createUserDiv(item, index) {
  let userDiv = document.createElement("div");
  userDiv.id = `id-${item.id}`;
  userDiv.style.borderStyle = "groove";

  // ID
  let idspan = document.createElement("span");
  let idinnerSpan = document.createElement("span");
  let idbr = document.createElement("br");
  idspan.onclick = function () {
    loadIdTodosPosts(item.id, index);
  };
  idspan.innerText = "ID : ";
  idinnerSpan.innerText = item.id;
  idspan.appendChild(idinnerSpan);
  idspan.appendChild(idbr);
  userDiv.appendChild(idspan);

  // Name
  let nameSpan = createSpan("Name :", item.name, `inputName-${index}`);
  userDiv.appendChild(nameSpan);

  // Email
  let emailSpan = createSpan("Email :", item.email, `inputEmail-${index}`);
  userDiv.appendChild(emailSpan);

  // Other Data
  let otherDataDiv = document.createElement("div");
  otherDataDiv.innerText = "Other Data";
  otherDataDiv.style.borderStyle = "inset";
  otherDataDiv.style.width = "75px";
  otherDataDiv.style.display = "inline-block";
  otherDataDiv.style.backgroundColor = "gray";
  otherDataDiv.onmouseover = function () {
    displayDiv(item.id);
  };
  otherDataDiv.onclick = function () {
    hideDiv(item.id);
  };
  userDiv.appendChild(otherDataDiv);

  // Delete Button
  let deleteBtn = createButton("Delete");
  deleteBtn.onclick = function () {
    DeleteUserIndex(item.id);
  };
  userDiv.appendChild(deleteBtn);

  // Update Button
  let updateBtn = createButton("Update");
  updateBtn.onclick = function () {
    updateUserData(index, item.id);
  };
  userDiv.appendChild(updateBtn);

  // Hidden Div
  let hiddenDiv = document.createElement("div");

  hiddenDiv.style.display = "none";
  let hiddenStreet = createSpan("Street :", item.address.street, `inputStreet-${index}`);
  hiddenDiv.id = `hiddenDiv${item.id}`;
  hiddenDiv.appendChild(hiddenStreet);
  let hiddenCity = createSpan("City :", item.address.city, `inputCity-${index}`);
  hiddenDiv.appendChild(hiddenCity);
  let hiddenZipCode = createSpan("Zip Code :", item.address.zipcode, `inputZipCode-${index}`);
  hiddenDiv.appendChild(hiddenZipCode);
  userDiv.appendChild(hiddenDiv);
  return userDiv;
}

// Creates a span
function createSpan(label, text, inputId) {
  let span = document.createElement("span");
  let innerSpan = document.createElement("input");
  if (inputId) {
    innerSpan.id = inputId;
  }
  innerSpan.value = text;
  let br = document.createElement("br");
  span.innerText = label;
  span.appendChild(innerSpan);
  span.appendChild(br);
  return span;
}

// Creats a button
function createButton(text) {
  let button = document.createElement("button");
  button.innerText = text;
  button.style.float = "right";
  return button;
}

// Change hiddenDiv  none => block
function displayDiv(index) {
  let hiddenDiv = document.getElementById(`hiddenDiv${index}`);
  hiddenDiv.style.display = "block";
}

// Change hiddenDiv block => none
function hideDiv(index) {
  let hiddenDiv = document.getElementById(`hiddenDiv${index}`);
  hiddenDiv.style.display = "none";
}

// Function to check if a user completed all todos

function checkTodosComp(user) {
  let userToDos = todos.filter((todo) => todo.userId === user.id);
  let completed = userToDos.every((todo) => todo.completed);
  let divId = document.getElementById(`id-${user.id}`);
  if (!divId) {
    return;
  }

  if (completed) {
    divId.style.outline = "3px solid green";
  } else {
    divId.style.outline = "3px solid red";
  }
}

// Search Funciton.
function searchData(newUsers) {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let filteredUsers;
  filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(input) || user.email.toLowerCase().includes(input);
  });
  // Clear the existing usersDiv
  let mainDiv = document.getElementById("usersDiv");
  mainDiv.innerHTML = "";

  // Load filtered users
  filteredUsers.forEach((item, index) => {
    let userDiv = createUserDiv(item, item.id);
    mainDiv.appendChild(userDiv);
    mainDiv.appendChild(document.createElement("br"));
  });
}

// Checks every 1 second if a user completed a task
async function loadDataAndInitialize() {
  await loadUsers();
  setInterval(() => {
    users.forEach((user) => {
      checkTodosComp(user);
    });
  }, 1000);
}

// Calls the Interval functions
loadDataAndInitialize();

// Delete a user
function DeleteUserIndex(id) {
  const index = users.findIndex((user) => user.id === id);
  console.log(index);
  users.splice(index, 1);

  searchData();
}

// Update user data
function updateUserData(id) {
  let userName = document.getElementById(`inputName-${id}`).value;
  let userEmail = document.getElementById(`inputEmail-${id}`).value;
  let userStreet = document.getElementById(`inputStreet-${id}`).value;
  let userCity = document.getElementById(`inputCity-${id}`).value;
  let userZipCode = document.getElementById(`inputZipCode-${id}`).value;
  let index = users.findIndex((user) => user.id === id);

  users[index].name = userName;
  users[index].email = userEmail;
  users[index].address.street = userStreet;
  users[index].address.city = userCity;
  users[index].address.zipcode = userZipCode;
  alert(`ID : ${id} User information has updated`);
  searchData();
  return;
}

// displays this user currect todos and posts.
function loadIdTodosPosts(index, id) {
  let correctDiv = document.getElementById(`id-${id}`);
  console.log(correctDiv);
  clearAllBackgrounds();
  correctDiv.style.backgroundColor = "orange";
  // Todos div
  let mainDivTodos = document.getElementById("userTodos");
  mainDivTodos.innerHTML = "";
  let UserTodos = document.createElement("div");
  let todosHead = createHeader(`Todos - User - ${index}`);
  todosHead.id = `head-todos`;
  let addTask = createButton("Add");
  addTask.onclick = function () {
    addNewTask(index, id);
  };
  mainDivTodos.appendChild(addTask);
  mainDivTodos.appendChild(todosHead);

  // Posts div
  let mainDivPosts = document.getElementById("userPosts");
  mainDivPosts.innerHTML = "";
  let postsHeader = createHeader(`Posts - User - ${index}`);
  let addPosts = createButton("Add");
  addPosts.onclick = function () {
    addNewPosts(index, id);
  };
  mainDivPosts.appendChild(addPosts);
  mainDivPosts.appendChild(postsHeader);

  // Creates the todos list
  let newTodo = todos.map((x) => (x.userId === index ? x : null)).filter(Boolean);
  console.log(newTodo);
  newTodo.forEach((item, index) => {
    let titleDiv = document.createElement("div");
    titleDiv.style.borderStyle = "groove";
    titleDiv.style.fontSize = "19px";
    // create Title
    let taskTitle = createTask("Title : ", item.title);
    // create status
    let taskStats = checkStats("Completed : ", item.completed, `taskId-${item.id}`);
    // create mark complete button
    let mark = createButton("Mark Completed");
    mark.onclick = function () {
      mark.id = `markButton-${item.id}`;
      completeSelectedTask(item.id);
    };
    if (newTodo[index].completed == true) {
      mark.style.display = "none";
    }

    taskTitle.appendChild(mark);
    titleDiv.appendChild(taskTitle);
    titleDiv.appendChild(taskStats);
    UserTodos.appendChild(titleDiv);
    mainDivTodos.appendChild(UserTodos);
  });
  loadUserPosts(index);
}

// Load Users posts
function loadUserPosts(index) {
  let newPosts = posts.filter((x) => x.userId === index);
  let mainDivPosts = document.getElementById("userPosts");
  console.log(newPosts);
  newPosts.forEach((item) => {
    let newPostDivs = document.createElement("div");
    newPostDivs.style.borderStyle = "groove";
    newPostDivs.style.fontSize = "19px";
    // Create Title
    let postTitle = createTask("Title : ", item.title);
    // Create Body
    let postBody = createTask("Body : ", item.body);
    newPostDivs.appendChild(postTitle);
    newPostDivs.appendChild(postBody);
    mainDivPosts.appendChild(newPostDivs);
  });
}

// Creats A header
function createHeader(text) {
  let head = document.createElement("h1");
  head.innerText = text;
  let br = document.createElement("br");
  head.appendChild(br);
  return head;
}

// Creates a task
function createTask(label, text) {
  let title = document.createElement("span");
  let innerTask = document.createElement("span");
  innerTask.innerText = text;
  let br = document.createElement("br");
  title.innerText = label;
  title.appendChild(innerTask);
  title.appendChild(br);
  return title;
}

// creats a stats for a task
function checkStats(label, status, TaskId) {
  let check = document.createElement("span");
  let innerStatus = document.createElement("span");
  innerStatus.innerText = status;
  innerStatus.id = TaskId;
  let br = document.createElement("br");
  check.innerText = label;
  check.appendChild(innerStatus);
  check.appendChild(br);
  return check;
}

// mark a task as a complete
function completeSelectedTask(index, user_id) {
  let id = document.getElementById(`taskId-${index}`);
  let button = document.getElementById(`markButton-${index}`);
  console.log(index);
  todos[index - 1].completed = true;
  alert("Task marked as completed");
  id.innerText = todos[index - 1].completed;
  button.style.display = "none";
}

// Clears all background color of each div
function clearAllBackgrounds() {
  for (let i = 0; i < users.length; i++) {
    console.log(users[i].id);
    let correctDiv = document.getElementById(`id-${users[i].id}`);
      if (correctDiv){
        correctDiv.style.background = "white";
      }
  }
}


function addNewTask(index, id) {
  let mainDivTodos = document.getElementById("userTodos");
  mainDivTodos.innerHTML = "";
  let header = createHeader(`New Todo - User - ${index}`);
  mainDivTodos.appendChild(header);
  // Inside Div
  let innerDiv = document.createElement("div");
  innerDiv.style.height = "200px";
  innerDiv.style.borderStyle = "groove";
  innerDiv.classList.add("TodoAddDiv");
  let newTodoInput = createSpan("Title : ", "", `Todos-add${index}`);
  newTodoInput.classList.add("spanStyle");
  // btn div
  let btnDiv = document.createElement("div");
  btnDiv.classList.add("divBtns");
  // Add button
  let addBtn = createButton("Add");
  addBtn.onclick = function () {
    addTask(index, id);
  };
  // Cancel button
  let cancelBtn = createButton("Cancel");
  cancelBtn.onclick = function () {
    cancelFun(index, id);
  };

  innerDiv.appendChild(newTodoInput);

  innerDiv.appendChild(btnDiv);
  btnDiv.appendChild(cancelBtn);
  btnDiv.appendChild(addBtn);
  mainDivTodos.appendChild(innerDiv);
}

function cancelFun(index, id) {
  loadIdTodosPosts(index, id);
}

function addTask(index, id) {
  let correctValue = document.getElementById(`Todos-add${index}`).value;
  let obj = { userId: index, id: todos.length + 1, title: correctValue, completed: false };
  todos.push(obj);
  loadIdTodosPosts(index, id);
}

function addNewPosts(index, id) {
  let mainDivPosts = document.getElementById("userPosts");
  mainDivPosts.innerHTML = "";
  let header = createHeader(`New Posts - User - ${index}`);
  mainDivPosts.appendChild(header);
  // inside div
  let innerDiv = document.createElement("div");
  innerDiv.style.height = "200px";
  innerDiv.style.borderStyle = "groove";
  let inputDiv = document.createElement("div");
  let newTitlePost = createSpan("Title : ", "", `Posts-addTitle${index}`);
  let newBodyPost = createSpan("Body : ", "", `Posts-addBody${index}`);
  newTitlePost.classList.add("spanStyle");
  newBodyPost.classList.add("spanStyle");
  // add button
  let addBtn = createButton("Add");
  addBtn.onclick = function () {
    addPost(index, id);
  };
  // Cancel button
  let cancelBtn = createButton("Cancel");
  cancelBtn.onclick = function () {
    cancelFun(index, id);
  };
  inputDiv.appendChild(newTitlePost);
  inputDiv.appendChild(newBodyPost);
  innerDiv.appendChild(inputDiv);
  innerDiv.appendChild(cancelBtn);
  innerDiv.appendChild(addBtn);
  mainDivPosts.appendChild(innerDiv);
}

function addPost(index, id) {
  let correctTitle = document.getElementById(`Posts-addTitle${index}`).value;
  let correctBody = document.getElementById(`Posts-addBody${index}`).value;
  let obj = { userId: index, id: posts.length, title: correctTitle, body: correctBody };
  posts.push(obj);
  loadIdTodosPosts(index, id);
}

// Add user to Users ->
function addUserToUsers() {
  let mainDivTodos = document.getElementById("userTodos");
  mainDivTodos.innerHTML = "";
  let mainDivPosts = document.getElementById("userPosts");
  mainDivPosts.innerHTML = "";
  let header = createHeader(`Add a users to array`);
  mainDivTodos.appendChild(header);
  let innerDiv = document.createElement("div");
  innerDiv.style.height = "200px";
  innerDiv.style.borderStyle = "groove";
  let inputDiv = document.createElement("div");
  let newNameUser = createSpan("Name : ", "", `addUser`);
  let newEmailUser = createSpan("Email : ", "", `addEmail`);
  newNameUser.classList.add("spanStyle");
  newEmailUser.classList.add("spanStyle");
  let btnDiv = document.createElement("div");
  btnDiv.classList.add("divBtns");
  let addUserBtn = createButton("Add");
  addUserBtn.onclick = function () {
    pushUser();
  };
  let cancelBtn = createButton("Cancel");
  cancelBtn.onclick = function () {
    cancelCreation();
  };
  // create in page
  inputDiv.appendChild(newNameUser);
  inputDiv.appendChild(newEmailUser);
  innerDiv.appendChild(inputDiv);
  innerDiv.appendChild(btnDiv);
  innerDiv.appendChild(cancelBtn);
  innerDiv.appendChild(addUserBtn);
  mainDivTodos.appendChild(innerDiv);
}

function cancelCreation() {
  let mainDivTodos = document.getElementById("userTodos");
  mainDivTodos.innerHTML = "";
  let mainDivPosts = document.getElementById("userPosts");
  mainDivPosts.innerHTML = "";
  searchData();
}


function pushUser() {
  let newUserName = document.getElementById(`addUser`).value;
  let newUserEmail = document.getElementById(`addEmail`).value;
  let userIndex = totalUsers + 1

  let obj = { id: userIndex, name: newUserName, email: newUserEmail, address: [{ street: null, city: null , zipcode: null }] };
  users.push(obj);
  let mainDivTodos = document.getElementById("userTodos");
  mainDivTodos.innerHTML = "";
  totalUsers++
  searchData();
}

// function pushUser(){
//   let newUserName = document.getElementById(`addUser`).value;
//   let newUserEmail = document.getElementById(`addEmail`).value;
//   let obj = { id: totalUsers, name: newUserName, email: newUserEmail, address: [{ street: "", city: "", zipcode: "" }] };
//   users.push(obj);
//   cancelCreation();
//   searchData();
// }

function getUserIndex() {
  const sortedIds = users.map((user) => user.id).sort((a, b) => a - b);
  for (let i = 1; i <= sortedIds.length; i++) {
    if (sortedIds[i - 1] !== i) {
      return i;
    }
  }
  return sortedIds.length + 1;
}
