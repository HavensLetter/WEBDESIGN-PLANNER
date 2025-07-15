// ===== DAILY LOGIC =====
if (document.body.classList.contains('daily-page')) {
  const datePicker = document.getElementById('datePicker');
  const todoList = document.getElementById('todo-list');
  const dayTitle = document.getElementById('dayTitle');
  const params = new URLSearchParams(window.location.search);
  const today = params.get('date') || new Date().toISOString().split('T')[0];

  datePicker.value = today;

  function formatDateLabel(dateStr) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  }

  dayTitle.textContent = formatDateLabel(today);

  function getKey() {
    return 'daily_' + datePicker.value;
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.todo-item').forEach(item => {
      tasks.push({
        text: item.querySelector('input[type="text"]').value,
        checked: item.querySelector('input[type="checkbox"]').checked
      });
    });
    localStorage.setItem(getKey(), JSON.stringify(tasks));
  }

  function loadTasks() {
    todoList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem(getKey()) || '[]');
    tasks.forEach(task => addTask(task.text, task.checked));
  }

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

  datePicker.addEventListener('change', () => {
    window.location.href = 'daily.html?date=' + datePicker.value;
  });

  loadTasks();
}

// ===== WEEKLY LOGIC =====
if (document.body.classList.contains('weekly-page')) {
  const weekGrid = document.getElementById('weekGrid');
  const weekLabel = document.getElementById('weekLabel');
  let weekStart = getWeekStart(new Date());

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  function getWeekKey() {
    return 'week_' + formatDate(weekStart);
  }

  function renderWeek() {
    weekGrid.innerHTML = '';
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    weekLabel.textContent = 'Week of ' + weekStart.toLocaleDateString();
    const saved = JSON.parse(localStorage.getItem(getWeekKey()) || '{}');

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const id = formatDate(d);
      const day = document.createElement('div');
      day.className = 'day';
      day.innerHTML = `<h2>${dayNames[i]}</h2><textarea id="${id}">${saved[id] || ''}</textarea>`;
      weekGrid.appendChild(day);
    }

    document.querySelectorAll('textarea').forEach(area => {
      area.addEventListener('input', () => {
        const data = {};
        document.querySelectorAll('textarea').forEach(a => {
          data[a.id] = a.value;
        });
        localStorage.setItem(getWeekKey(), JSON.stringify(data));
      });
    });
  }

  window.nextWeek = function () {
    weekStart.setDate(weekStart.getDate() + 7);
    renderWeek();
  };

  window.prevWeek = function () {
    weekStart.setDate(weekStart.getDate() - 7);
    renderWeek();
  };

  renderWeek();
}

// ===== NOTES LOGIC =====
if (document.body.classList.contains('notes-page')) {
  let page = 1;
  const noteArea = document.getElementById('noteArea');
  const noteLabel = document.getElementById('noteLabel');

  function getNoteKey() {
    return 'note_' + page;
  }

  function saveNote() {
    localStorage.setItem(getNoteKey(), noteArea.value);
  }

  function loadNote() {
    noteLabel.textContent = 'Page ' + page;
    noteArea.value = localStorage.getItem(getNoteKey()) || '';
  }

  window.nextNote = function () {
    saveNote();
    page++;
    loadNote();
  };

  window.prevNote = function () {
    if (page > 1) {
      saveNote();
      page--;
      loadNote();
    }
  };

  noteArea.addEventListener('input', saveNote);
  loadNote();
}

// ===== CALENDAR LOGIC =====
if (document.body.classList.contains('calendar-page')) {
  const calendarDays = document.getElementById("calendarDays");
  const monthYear = document.getElementById("monthYear");
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  function renderCalendar(month, year) {
    calendarDays.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = new Date(year, month).toLocaleString("default", {
      month: "long",
      year: "numeric"
    });

    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement("div");
      calendarDays.appendChild(blank);
    }

    for (let day = 1; day <= lastDate; day++) {
      const cell = document.createElement("div");
      cell.className = "calendar-day";
      cell.textContent = day;

      const isoDate = new Date(year, month, day).toISOString().split("T")[0];
      cell.onclick = () => {
        localStorage.setItem("selectedDate", isoDate);
        window.location.href = "daily.html?date=" + isoDate;
      };

      calendarDays.appendChild(cell);
    }
  }

  window.nextMonth = function () {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  };

  window.prevMonth = function () {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  };

  renderCalendar(currentMonth, currentYear);
}
