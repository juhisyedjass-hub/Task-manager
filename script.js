// script.js
const themeToggle = document.getElementById("themeToggle");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchTask = document.getElementById("searchTask");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Add Task
addTaskBtn.addEventListener("click", () => {

  const taskText = taskInput.value.trim();
  const dateValue = taskDate.value;

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    date: dateValue,
    completed: false
  };

  tasks.push(task);

  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskDate.value = "";
});

// Save Local Storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {

  taskList.innerHTML = "";

  const searchValue = searchTask.value.toLowerCase();

  let filteredTasks = tasks.filter(task => {

    const matchesSearch =
      task.text.toLowerCase().includes(searchValue);

    if (currentFilter === "pending") {
      return !task.completed && matchesSearch;
    }

    if (currentFilter === "completed") {
      return task.completed && matchesSearch;
    }

    return matchesSearch;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <div style="text-align:center; color:#cbd5e1;">
        No tasks found 😔
      </div>
    `;
    return;
  }

  filteredTasks.forEach(task => {

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    if (task.completed) {
      taskCard.classList.add("completed");
    }

    taskCard.innerHTML = `
    
      <div class="task-left">
      
        <input type="checkbox" ${task.completed ? "checked" : ""}
          onchange="toggleTask(${task.id})"
        />

        <div class="task-info">
          <h3>${task.text}</h3>
          <p>📅 ${task.date || "No Date Added"}</p>
        </div>

      </div>

      <button class="delete-btn"
        onclick="deleteTask(${task.id})">
        Delete
      </button>

    `;

    taskList.appendChild(taskCard);
  });
}

// Toggle Complete
function toggleTask(id) {

  tasks = tasks.map(task => {

    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(id) {

  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();
}

// Filter Buttons
filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    filterButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });
});

// Search
searchTask.addEventListener("input", renderTasks);

// Initial Render
renderTasks();
// LOAD SAVED THEME

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){
  document.body.classList.add("light-mode");
  themeToggle.innerHTML = "☀️ Light Mode";
}


// TOGGLE THEME

themeToggle.addEventListener("click", function(){

  document.body.classList.toggle("light-mode");

  if(document.body.classList.contains("light-mode")){

    themeToggle.innerHTML = "☀️ Light Mode";

    localStorage.setItem("theme", "light");

  }else{

    themeToggle.innerHTML = "🌙 Dark Mode";

    localStorage.setItem("theme", "dark");
  }

});