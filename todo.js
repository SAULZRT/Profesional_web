const TodoManager = (() => {
  const STORAGE_KEY = 'darklinca_todos';
  const CATEGORIES = ['Trabajo', 'Personal', 'Urgente', 'Ideas', 'Compras'];
  const PRIORITIES = ['Baja', 'Media', 'Alta', 'Crítica'];
  const TAGS = ['bug', 'feature', 'mejora', 'reunión', 'código', 'docs'];

  let todos = loadTodos();

  function loadTodos() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function addTodo(title, category = 'Personal', priority = 'Media', dueDate = null, tags = []) {
    const todo = {
      id: Date.now(),
      title: SecurityManager.sanitizeInput(title),
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate,
      tags: tags || [],
      subtasks: [],
      notes: '',
      estimatedTime: 0,
      timeSpent: 0
    };
    todos.push(todo);
    saveTodos();
    return todo;
  }

  function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
  }

  function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = new Date().toISOString();
      saveTodos();
    }
  }

  function updateTodo(id, updates) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      if (updates.title) todo.title = SecurityManager.sanitizeInput(updates.title);
      if (updates.category) todo.category = updates.category;
      if (updates.priority) todo.priority = updates.priority;
      if (updates.dueDate !== undefined) todo.dueDate = updates.dueDate;
      if (updates.tags) todo.tags = updates.tags;
      if (updates.notes !== undefined) todo.notes = SecurityManager.sanitizeInput(updates.notes);
      if (updates.estimatedTime !== undefined) todo.estimatedTime = updates.estimatedTime;
      if (updates.timeSpent !== undefined) todo.timeSpent = updates.timeSpent;
      todo.updatedAt = new Date().toISOString();
      saveTodos();
    }
  }

  function addSubtask(todoId, subtaskTitle) {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      const subtask = {
        id: Date.now(),
        title: SecurityManager.sanitizeInput(subtaskTitle),
        completed: false
      };
      todo.subtasks.push(subtask);
      saveTodos();
    }
  }

  function toggleSubtask(todoId, subtaskId) {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      const subtask = todo.subtasks.find(s => s.id === subtaskId);
      if (subtask) {
        subtask.completed = !subtask.completed;
        saveTodos();
      }
    }
  }

  function deleteSubtask(todoId, subtaskId) {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      todo.subtasks = todo.subtasks.filter(s => s.id !== subtaskId);
      saveTodos();
    }
  }

  function getTodos(filter = 'all') {
    switch (filter) {
      case 'completed':
        return todos.filter(t => t.completed);
      case 'pending':
        return todos.filter(t => !t.completed);
      case 'overdue':
        return todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date());
      case 'today':
        return todos.filter(t => {
          if (!t.dueDate) return false;
          const due = new Date(t.dueDate).toDateString();
          return due === new Date().toDateString();
        });
      default:
        return todos;
    }
  }

  function search(query) {
    const q = query.toLowerCase();
    return todos.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.notes.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  function getTodosByCategory(category) {
    return todos.filter(t => t.category === category);
  }

  function getTodosByPriority(priority) {
    return todos.filter(t => t.priority === priority);
  }

  function getTodosByTag(tag) {
    return todos.filter(t => t.tags.includes(tag));
  }

  function sortTodos(by = 'priority') {
    const sorted = [...todos];
    if (by === 'priority') {
      const priorityOrder = { 'Crítica': 0, 'Alta': 1, 'Media': 2, 'Baja': 3 };
      sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (by === 'date') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (by === 'duedate') {
      sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }
    return sorted;
  }

  function getStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
    const byCategory = {};
    const byPriority = {};
    
    TodoManager.CATEGORIES.forEach(cat => {
      byCategory[cat] = todos.filter(t => t.category === cat).length;
    });
    
    TodoManager.PRIORITIES.forEach(pri => {
      byPriority[pri] = todos.filter(t => t.priority === pri).length;
    });

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
      byCategory,
      byPriority,
      totalTimeSpent: todos.reduce((sum, t) => sum + t.timeSpent, 0),
      totalEstimatedTime: todos.reduce((sum, t) => sum + t.estimatedTime, 0)
    };
  }

  return {
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    getTodos,
    search,
    getTodosByCategory,
    getTodosByPriority,
    getTodosByTag,
    sortTodos,
    getStats,
    CATEGORIES,
    PRIORITIES,
    TAGS,
    get all() { return todos; }
  };
})();

const TodoUI = (() => {
  let todoModal, todoForm, todosList, filterBtn, sortBtn, categorySelect, prioritySelect;
  let searchInput, statsContainer, currentFilter = 'pending', currentSort = 'priority';
  let editingId = null;

  function init() {
    createTodoModal();
    setupEventListeners();
    render();
  }

  function createTodoModal() {
    const html = `
      <div id="todoModal" class="todo-modal">
        <div class="todo-container">
          <div class="todo-header">
            <div class="todo-title-section">
              <h3>📋 Gestor de Tareas Avanzado</h3>
              <span id="statsPreview" class="stats-preview"></span>
            </div>
            <button id="closeTodoBtn" class="close-game">✕</button>
          </div>
          
          <div class="todo-form-section">
            <input type="text" id="todoInput" placeholder="Agregar nueva tarea..." maxlength="100">
            <select id="todoCategory">
              ${TodoManager.CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            </select>
            <select id="todoPriority">
              ${TodoManager.PRIORITIES.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
            <input type="date" id="todoDueDate" class="todo-date-input">
            <button id="addTodoBtn" class="todo-add-btn">+ Agregar</button>
          </div>

          <div class="todo-search-bar">
            <input type="text" id="todoSearch" placeholder="🔍 Buscar tareas..." maxlength="50">
          </div>

          <div class="todo-controls">
            <div class="filter-group">
              <button id="filterPending" class="todo-filter-btn active">📌 Pendientes</button>
              <button id="filterToday" class="todo-filter-btn">📅 Hoy</button>
              <button id="filterOverdue" class="todo-filter-btn">⚠️ Vencidas</button>
              <button id="filterAll" class="todo-filter-btn">📚 Todas</button>
              <button id="filterCompleted" class="todo-filter-btn">✓ Completadas</button>
            </div>
            <div class="sort-group">
              <button id="sortPriority" class="todo-sort-btn active">⚡ Prioridad</button>
              <button id="sortDate" class="todo-sort-btn">🕐 Fecha Creación</button>
              <button id="sortDueDate" class="todo-sort-btn">📆 Vencimiento</button>
            </div>
          </div>

          <div id="todoStats" class="todo-stats">
            <div class="stat-item">
              <span class="stat-label">Total</span>
              <span class="stat-value" id="statTotal">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Completadas</span>
              <span class="stat-value" id="statCompleted">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Pendientes</span>
              <span class="stat-value" id="statPending">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Vencidas</span>
              <span class="stat-value" id="statOverdue">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Progreso</span>
              <span class="stat-value" id="statProgress">0%</span>
            </div>
          </div>

          <div id="todosList" class="todos-list"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    
    todoModal = document.getElementById('todoModal');
    todoForm = document.getElementById('todoInput');
    todosList = document.getElementById('todosList');
    filterBtn = document.getElementById('filterBtn');
    sortBtn = document.getElementById('sortBtn');
    categorySelect = document.getElementById('todoCategory');
    prioritySelect = document.getElementById('todoPriority');
    searchInput = document.getElementById('todoSearch');
    statsContainer = document.getElementById('todoStats');
  }

  function setupEventListeners() {
    document.getElementById('addTodoBtn').addEventListener('click', addNewTodo);
    todoForm.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('addTodoBtn').click();
      }
    });

    document.getElementById('closeTodoBtn').addEventListener('click', () => {
      todoModal.classList.remove('active');
    });

    document.getElementById('filterPending').addEventListener('click', () => {
      setFilter('pending');
    });
    document.getElementById('filterToday').addEventListener('click', () => {
      setFilter('today');
    });
    document.getElementById('filterOverdue').addEventListener('click', () => {
      setFilter('overdue');
    });
    document.getElementById('filterAll').addEventListener('click', () => {
      setFilter('all');
    });
    document.getElementById('filterCompleted').addEventListener('click', () => {
      setFilter('completed');
    });

    document.getElementById('sortPriority').addEventListener('click', () => {
      setSort('priority');
    });
    document.getElementById('sortDate').addEventListener('click', () => {
      setSort('date');
    });
    document.getElementById('sortDueDate').addEventListener('click', () => {
      setSort('duedate');
    });

    searchInput.addEventListener('input', (e) => {
      render(currentFilter, currentSort, e.target.value);
    });
  }

  async function addNewTodo() {
    if (!todoForm.value.trim()) return;

    const title = todoForm.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    const dueDate = document.getElementById('todoDueDate').value;

    TodoManager.addTodo(title, category, priority, dueDate);
    
    try {
      const priorityColors = { 'Crítica': 0xff0000, 'Alta': 0xff6600, 'Media': 0xffff00, 'Baja': 0x00ff00 };
      const timestamp = new Date().toLocaleString('es-ES', { 
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const payload = {
        embeds: [{
          title: '📋 Nueva Tarea Agregada',
          description: title,
          color: priorityColors[priority] || 0xffff00,
          fields: [
            { name: '📂 Categoría', value: category || 'Personal', inline: true },
            { name: '⚡ Prioridad', value: priority || 'Media', inline: true },
            { name: '📅 Vencimiento', value: dueDate || 'Sin fecha', inline: true },
            { name: '⏰ Registrada', value: timestamp, inline: false }
          ]
        }]
      };

      try {
        await fetch('http://localhost:3000/api/todo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, category, priority, dueDate })
        });
      } catch (backendErr) {
        console.log('Backend no disponible, usando webhook directa...');
        await WebhookManager.send(payload);
      }
    } catch (err) {
      console.error('Error al registrar tarea:', err);
    }

    todoForm.value = '';
    document.getElementById('todoDueDate').value = '';
    render(currentFilter, currentSort);
  }

  function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-group button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('filter' + filter.charAt(0).toUpperCase() + filter.slice(1)).classList.add('active');
    render(currentFilter, currentSort);
  }

  function setSort(sort) {
    currentSort = sort;
    document.querySelectorAll('.sort-group button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('sort' + sort.charAt(0).toUpperCase() + sort.slice(1)).classList.add('active');
    render(currentFilter, currentSort);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Hoy';
    if (date.toDateString() === tomorrow.toDateString()) return 'Mañana';
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  }

  function getDaysUntil(dateStr) {
    if (!dateStr) return null;
    const due = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function render(filter = currentFilter, sort = currentSort, searchQuery = '') {
    let todos = sort === 'priority' 
      ? TodoManager.sortTodos('priority')
      : sort === 'date'
      ? TodoManager.sortTodos('date')
      : TodoManager.sortTodos('duedate');
    
    todos = filter === 'all' ? todos : TodoManager.getTodos(filter);
    
    if (searchQuery) {
      todos = TodoManager.search(searchQuery);
    }

    const stats = TodoManager.getStats();
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statCompleted').textContent = stats.completed;
    document.getElementById('statPending').textContent = stats.pending;
    document.getElementById('statOverdue').textContent = stats.overdue;
    document.getElementById('statProgress').textContent = stats.completionRate + '%';

    todosList.innerHTML = todos.length === 0
      ? '<div class="empty-todos">No hay tareas que mostrar</div>'
      : todos.map(todo => {
          const daysUntil = getDaysUntil(todo.dueDate);
          const isOverdue = daysUntil !== null && daysUntil < 0;
          const dueSoon = daysUntil !== null && daysUntil <= 3 && daysUntil >= 0;
          const completedSubtasks = todo.subtasks.filter(s => s.completed).length;
          const totalSubtasks = todo.subtasks.length;
          const subtaskProgress = totalSubtasks === 0 ? 100 : Math.round((completedSubtasks / totalSubtasks) * 100);

          return `
            <div class="todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority.toLowerCase()} ${isOverdue ? 'overdue' : ''} ${dueSoon ? 'due-soon' : ''}">
              <div class="todo-item-header">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="TodoManager.toggleTodo(${todo.id}); TodoUI.render()">
                <div class="todo-content">
                  <div class="todo-title">${SecurityManager.sanitizeHTML(todo.title)}</div>
                  ${todo.notes ? `<div class="todo-notes">${SecurityManager.sanitizeHTML(todo.notes)}</div>` : ''}
                  ${todo.tags.length > 0 ? `
                    <div class="todo-tags">
                      ${todo.tags.map(tag => `<span class="todo-tag">#${tag}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
              
              <div class="todo-meta-section">
                <div class="todo-meta">
                  <span class="todo-cat" title="Categoría">${todo.category}</span>
                  <span class="todo-pri" title="Prioridad">${todo.priority}</span>
                  ${todo.dueDate ? `<span class="todo-date ${isOverdue ? 'overdue' : dueSoon ? 'due-soon' : ''}" title="Vencimiento">${formatDate(todo.dueDate)}</span>` : ''}
                </div>
                ${totalSubtasks > 0 ? `
                  <div class="todo-progress">
                    <div class="progress-bar"><div class="progress-fill" style="width: ${subtaskProgress}%"></div></div>
                    <span class="progress-text">${completedSubtasks}/${totalSubtasks}</span>
                  </div>
                ` : ''}
              </div>

              <div class="todo-actions">
                <button class="todo-edit" onclick="TodoUI.toggleEditMode(${todo.id})">✏️</button>
                <button class="todo-delete" onclick="TodoManager.deleteTodo(${todo.id}); TodoUI.render()">🗑️</button>
              </div>
            </div>
          `;
        }).join('');
  }

  function toggleEditMode(id) {
    const todo = TodoManager.all.find(t => t.id === id);
    if (!todo) return;
    
    alert('Editar: ' + todo.title + '\n\nEdición inline próximamente...');
  }

  function openTodoModal() {
    todoModal.classList.add('active');
    render();
  }

  return {
    init,
    render,
    openTodoModal,
    toggleEditMode
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  TodoUI.init();
});
