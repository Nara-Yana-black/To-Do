let taskCount = 0; // Track task count to ensure unique names
let currentTask = null; // Track currently opened task for notes

// Check if tasks are saved in localStorage and load them
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        addTaskToPage(task.name, task.isDone, task.note);
    });
    taskCount = savedTasks.length; // Update taskCount based on saved tasks
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-container li').forEach(taskItem => {
        const taskName = taskItem.id;
        const taskIsDone = taskItem.querySelector('.task-name').style.textDecoration === 'line-through';
        const taskNote = localStorage.getItem(taskName) || '';
        tasks.push({ name: taskName, isDone: taskIsDone, note: taskNote });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to create a new task
function createNewTask() {
    let taskName = `Task ${taskCount + 1}`; // Generate unique task name
    taskCount++;

    addTaskToPage(taskName);
}

// Function to add a task to the page
function addTaskToPage(taskName, isDone = false, note = '') {
    // Create a new task element
    const taskItem = document.createElement('li');
    taskItem.id = taskName;
    taskItem.innerHTML = `
        <span class="task-name" style="text-decoration: ${isDone ? 'line-through' : 'none'}">${taskName}</span>
        <div class="task-actions">
            <button class="done-btn" onclick="toggleDone('${taskName}')">Done</button>
            <button class="edit-btn" onclick="editTask('${taskName}')">Edit</button>
            <button class="rename-btn" onclick="renameTask('${taskName}')">Rename</button>
            <button class="delete-btn" onclick="deleteTask('${taskName}')">Delete</button>
        </div>
    `;
    // Append task to the task container
    document.querySelector('#task-container ul').appendChild(taskItem);
}

// Toggle the "Done" status of the task (strikethrough)
function toggleDone(taskName) {
    const taskItem = document.getElementById(taskName);
    const taskNameElement = taskItem.querySelector('.task-name');
    taskNameElement.style.textDecoration =
        taskNameElement.style.textDecoration === 'line-through' ? 'none' : 'line-through';
    saveTasks(); // Save tasks to localStorage after toggling
}

// Edit task (open modal for editing)
function editTask(taskName) {
    currentTask = taskName;
    openModal(taskName, true);
}

// Rename task
function renameTask(taskName) {
    const taskItem = document.getElementById(taskName);
    const newTaskName = prompt("Enter new task name:", taskItem.id);
    if (newTaskName && newTaskName !== taskName) {
        // Update task ID and name
        taskItem.id = newTaskName;
        taskItem.querySelector('.task-name').textContent = newTaskName;
        saveTasks(); // Save tasks to localStorage after renaming
    }
}

// Delete task
function deleteTask(taskName) {
    const taskItem = document.getElementById(taskName);
    taskItem.remove();
    saveTasks(); // Save tasks to localStorage after deletion
}

// Open modal for task details
function openModal(taskName, isEditable = false) {
    currentTask = taskName;
    const noteTextarea = document.getElementById('task-note-textarea');
    const savedNote = localStorage.getItem(taskName);
    noteTextarea.value = savedNote || '';
    noteTextarea.disabled = !isEditable;

    document.getElementById('note-modal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('note-modal').style.display = 'none';
}

// Save task note
function saveNote() {
    const noteTextarea = document.getElementById('task-note-textarea');
    if (currentTask) {
        localStorage.setItem(currentTask, noteTextarea.value);
    }
    saveTasks(); // Save tasks to localStorage after saving note
    closeModal();
}

// Attach event listener to the new task button
document.getElementById('new-task-button').addEventListener('click', createNewTask);

// Load tasks when the page is loaded
window.onload = loadTasks;