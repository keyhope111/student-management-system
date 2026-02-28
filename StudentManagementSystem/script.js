let students = [];
let loggedIn = false;
let currentUser = null;

let users = JSON.parse(localStorage.getItem('sims_users') || '[]');
if (!users.length) {
    users.push({ username: 'admin', password: 'password' });
    localStorage.setItem('sims_users', JSON.stringify(users));
}

function saveUsers() {
    localStorage.setItem('sims_users', JSON.stringify(users));
}

function renderStudents(list) {
    const tbody = document.getElementById('students-tbody');
    tbody.innerHTML = '';
    list.forEach((s, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.course}</td>
            <td>${s.year}</td>
            <td>${s.age}</td>
            <td>
                <button data-action="edit" data-index="${idx}">Edit</button>
                <button data-action="delete" data-index="${idx}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showApp() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('user-info').textContent = currentUser || '';
}

function logout() {
    loggedIn = false;
    currentUser = null;
    document.getElementById('app').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('register-panel').classList.add('hidden');
    document.getElementById('login-panel').classList.remove('hidden');
    document.getElementById('login-form').reset();
    document.getElementById('user-info').textContent = '';
}

document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    const found = users.find(x => x.username === u && x.password === p);
    if (found) {
        loggedIn = true;
        currentUser = u;
        document.getElementById('login-error').textContent = '';
        showApp();
    } else {
        document.getElementById('login-error').textContent = 'No account found with that username and password.';
    }
});

document.getElementById('show-register').addEventListener('click', () => {
    document.getElementById('login-panel').classList.add('hidden');
    document.getElementById('register-panel').classList.remove('hidden');
    document.getElementById('login-error').textContent = '';
});

document.getElementById('show-login').addEventListener('click', () => {
    document.getElementById('register-panel').classList.add('hidden');
    document.getElementById('login-panel').classList.remove('hidden');
    document.getElementById('register-error').textContent = '';
});

document.getElementById('register-form').addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('reg-username').value.trim();
    const p = document.getElementById('reg-password').value;
    const c = document.getElementById('reg-confirm').value;
    if (!u || !p) return;
    if (p !== c) {
        document.getElementById('register-error').textContent = 'Passwords do not match';
        return;
    }
    if (users.some(x => x.username === u)) {
        document.getElementById('register-error').textContent = 'Username already exists';
        return;
    }
    users.push({ username: u, password: p });
    saveUsers();
    document.getElementById('register-error').textContent = '';
    document.getElementById('register-panel').classList.add('hidden');
    document.getElementById('login-panel').classList.remove('hidden');
    document.getElementById('login-error').textContent = 'Account created. You may now log in.';
    document.getElementById('register-form').reset();
});

document.getElementById('logout-btn').addEventListener('click', logout);

document.getElementById('student-form').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('student-id').value.trim();
    const name = document.getElementById('student-name').value.trim();
    const course = document.getElementById('student-course').value.trim();
    const year = document.getElementById('student-year').value;
    const age = document.getElementById('student-age').value;
    if (!id || !name) return;
    const editing = document.getElementById('student-form').dataset.editing;
    if (editing != null) {
        const idx = parseInt(editing, 10);
        students[idx] = { id, name, course, year, age };
        delete document.getElementById('student-form').dataset.editing;
    } else {
        students.push({ id, name, course, year, age });
    }
    renderStudents(students);
    document.getElementById('student-form').reset();
});

document.getElementById('students-tbody').addEventListener('click', e => {
    const action = e.target.dataset.action;
    const idx = parseInt(e.target.dataset.index, 10);
    if (action === 'edit') {
        const s = students[idx];
        document.getElementById('student-id').value = s.id;
        document.getElementById('student-name').value = s.name;
        document.getElementById('student-course').value = s.course;
        document.getElementById('student-year').value = s.year;
        document.getElementById('student-age').value = s.age;
        document.getElementById('student-form').dataset.editing = idx;
    } else if (action === 'delete') {
        students.splice(idx, 1);
        renderStudents(students);
    }
});

renderStudents(students);

document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '🙈';
        } else {
            input.type = 'password';
            btn.textContent = '👁️';
        }
    });
});

renderStudents(students);

document.getElementById('toggle-student-list')
        .addEventListener('click', () => {
            document.getElementById('student-table-container')
                    .classList.toggle('hidden');
});