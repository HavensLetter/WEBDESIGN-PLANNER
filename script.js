const params = new URLSearchParams(window.location.search);
const datePicker = document.getElementById('datePicker');
const todoList = document.getElementById('todo-list');
const dayTitle = document.getElementById('dayTitle');

// Use selected date or today's date
const today = params.get('date') || new Date().toISOString().split('T')[0];
datePicker.value = today;

// Format and display heading
function formatDateLabel(dateStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

dayTitle.textContent = formatDateLabel(today);

// Key for saving this day's data
function getStorageKey() {
  return 'daily_' + datePicker.value;
}

// Save all tasks for the current day
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.todo-item').forEach(item => {
    tasks.push({
      text: item.querySelector('input[type="text"]').value,
      checked: item.querySelector('input[type="checkbox"]').checked
    });
  });
  localStorage.setItem(getStorageKey(), JSON.stringify(tasks));
}

// Load tasks for the selected date
function loadTasks() {
  todoList.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
  tasks.forEach(task => addTask(task.text, task.checked));
}

// Add a task block
function addTask(text = '', checked = false) {
  const div = document.createElement('div');
  div.className = 'todo-item';
  div.innerHTML = `
    <input type="checkbox" ${checked ? 'checked' : ''}>
    <input type="text" value="${text}">
  `;
  div.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', saveTasks);
    el.addEventListener('change', saveTasks);
  });
  todoList.appendChild(div);
}

// Change selected date
datePicker.addEventListener('change', () => {
  window.location.href = 'daily.html?date=' + datePicker.value;
});

// Load on page start
loadTasks();// Optional: You can add interactivity later
