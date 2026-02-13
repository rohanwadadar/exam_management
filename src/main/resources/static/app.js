const API = "http://localhost:8080";
let currentUser = null;
let examTimer = null;
let examTimeLeft = 0;
let currentExamId = null;
let departments = [];

// ===== INIT =====
async function loadDepartments() {
    try { const r = await fetch(`${API}/department/`); departments = await r.json(); } catch (e) { departments = []; }
}
function populateDeptSelect(selectId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="">Select Department</option>' + departments.map(d => `<option value="${d.id}">${d.name} (${d.code})</option>`).join('');
}
loadDepartments().then(() => populateDeptSelect('reg-dept'));

// ===== AUTH =====
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const deptId = document.getElementById('reg-dept').value;
        const data = {
            username: document.getElementById('reg-username').value, password: document.getElementById('reg-password').value,
            firstName: document.getElementById('reg-fname').value, lastName: document.getElementById('reg-lname').value,
            email: document.getElementById('reg-email').value, phone: document.getElementById('reg-phone').value,
            registrationNumber: document.getElementById('reg-regno').value, semester: document.getElementById('reg-semester').value,
            role: "STUDENT", department: deptId ? { id: parseInt(deptId) } : null
        };
        const res = await fetch(`${API}/user/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(await res.text());
        alert("Account created! Please login."); document.getElementById('signupForm').reset();
        new bootstrap.Tab(document.querySelector('[data-bs-target="#login"]')).show();
    } catch (err) { alert("Registration Error: " + err.message); }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const data = { username: document.getElementById('login-username').value, password: document.getElementById('login-password').value };
        const res = await fetch(`${API}/user/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error("Invalid username or password");
        currentUser = await res.json(); startSession();
    } catch (err) { document.getElementById('auth-status').innerText = err.message; }
});

function startSession() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('userInfo').classList.remove('d-none');
    document.getElementById('displayUsername').innerText = `Hello, ${currentUser.firstName}`;
    document.getElementById('displayRole').innerText = currentUser.role;
    document.getElementById('displayRole').className = `badge me-2 ${currentUser.role === 'ADMIN' ? 'bg-danger' : 'bg-success'}`;
    if (currentUser.role === 'ADMIN') {
        document.getElementById('adminMenu').style.display = 'block';
        document.getElementById('studentMenu').style.display = 'none';
        showPanel('adminExams');
    } else {
        document.getElementById('adminMenu').style.display = 'none';
        document.getElementById('studentMenu').style.display = 'block';
        showPanel('studentExams');
    }
}
function logout() { location.reload(); }

// ===== NAVIGATION =====
function showPanel(id) {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    if (event && event.target) event.target.closest('.sidebar-link')?.classList.add('active');
    const panels = {
        studentExams: renderStudentExams, myRegistrations: renderMyRegistrations, myResults: renderMyResults,
        adminExams: renderAdminExams, manageQuestions: renderManageQuestions, manageStudents: renderManageStudents,
        viewResults: renderViewResults, manageDepts: renderManageDepts
    };
    if (panels[id]) panels[id]();
}

// ===== STUDENT: Available Exams =====
async function renderStudentExams() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<div class="card glass-card p-4 fade-in"><h4 class="mb-3"><i class="bi bi-card-checklist me-2"></i>Available Exams</h4><div class="row" id="studentExamsList"><div class="text-center text-muted">Loading...</div></div></div>';
    const res = await fetch(`${API}/exam/active`);
    const exams = await res.json();
    document.getElementById('studentExamsList').innerHTML = exams.length === 0 ? '<p class="text-muted">No active exams available.</p>' :
        exams.map(e => `<div class="col-md-6 mb-3"><div class="card p-3 h-100">
            <div class="d-flex justify-content-between"><span class="badge bg-primary mb-2">${e.department?.name || 'General'}</span><span class="text-muted small">${e.maxMarks} Marks</span></div>
            <h5 class="fw-bold">${e.title}</h5><p class="text-muted small mb-1">${e.subject} | Sem ${e.semester || '-'} | ${e.durationMinutes || 30} min</p>
            <p class="text-muted small">${e.description || ''}</p>
            <div class="mt-auto d-flex gap-2"><button class="btn btn-outline-primary btn-sm" onclick="enrollExam(${e.id})">Enroll</button>
            <button class="btn btn-primary btn-sm" onclick="startExam(${e.id}, '${e.title}', ${e.durationMinutes || 30})">Start Exam</button></div>
            </div></div>`).join('');
}

async function enrollExam(examId) {
    try {
        const res = await fetch(`${API}/exam/student/register?userId=${currentUser.id}&examId=${examId}`, { method: 'POST' });
        if (!res.ok) throw new Error(await res.text());
        alert("Enrolled Successfully!");
    } catch (err) { alert(err.message); }
}

// ===== STUDENT: My Registrations =====
async function renderMyRegistrations() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<div class="card glass-card p-4 fade-in"><h4 class="mb-3"><i class="bi bi-journal-check me-2"></i>My Registrations</h4><div class="table-responsive"><table class="table"><thead><tr><th>Exam</th><th>Subject</th><th>Department</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody id="regList"></tbody></table></div></div>';
    const res = await fetch(`${API}/exam/student/registrations/${currentUser.id}`);
    const data = await res.json();
    document.getElementById('regList').innerHTML = data.map(r => `<tr>
        <td class="fw-semibold">${r.exam.title}</td><td>${r.exam.subject}</td><td>${r.exam.department?.name || '-'}</td>
        <td><span class="text-primary fw-bold">${r.examDate || 'Pending...'}</span></td>
        <td><span class="badge ${r.status === 'COMPLETED' ? 'bg-success' : r.status === 'APPROVED' ? 'bg-info' : 'bg-warning text-dark'}">${r.status}</span></td>
        <td>${!r.examTaken ? `<button class="btn btn-sm btn-primary" onclick="startExam(${r.exam.id}, '${r.exam.title}', ${r.exam.durationMinutes || 30})">Take Exam</button>` : '<span class="text-success">✓ Done</span>'}</td>
        </tr>`).join('') || '<tr><td colspan="6" class="text-center text-muted">No registrations yet</td></tr>';
}

// ===== STUDENT: My Results =====
async function renderMyResults() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<div class="card glass-card p-4 fade-in"><h4 class="mb-3"><i class="bi bi-trophy me-2"></i>My Results</h4><div id="resultsList"></div></div>';
    const res = await fetch(`${API}/result/student/${currentUser.id}`);
    const data = await res.json();
    document.getElementById('resultsList').innerHTML = data.length === 0 ? '<p class="text-muted">No results yet.</p>' :
        data.map(r => `<div class="question-card ${r.status === 'PASSED' ? 'result-pass' : 'result-fail'} fade-in mb-3">
            <div class="d-flex justify-content-between"><h5 class="fw-bold">${r.exam.title}</h5><span class="badge ${r.status === 'PASSED' ? 'bg-success' : 'bg-danger'} fs-6">${r.status}</span></div>
            <div class="row mt-3"><div class="col-3"><div class="stat-card"><h3>${r.marksObtained}/${r.totalMarks}</h3><p>Score</p></div></div>
            <div class="col-3"><div class="stat-card"><h3>${r.percentage}%</h3><p>Percentage</p></div></div>
            <div class="col-3"><div class="stat-card"><h3>${r.correctAnswers}/${r.totalQuestions}</h3><p>Correct</p></div></div>
            <div class="col-3"><div class="stat-card"><h3>${r.attemptedQuestions}</h3><p>Attempted</p></div></div></div>
            <p class="text-muted small mt-2">Submitted: ${r.submittedAt || '-'}</p></div>`).join('');
}

// ===== EXAM TAKING =====
async function startExam(examId, title, duration) {
    try {
        // Check if already taken
        const checkRes = await fetch(`${API}/result/check?studentId=${currentUser.id}&examId=${examId}`);
        const checkData = await checkRes.json();
        if (checkData && checkData.status && checkData.status !== 'IN_PROGRESS') {
            alert("You have already taken this exam!"); return;
        }
    } catch (e) { }
    if (!confirm(`Start "${title}"? Duration: ${duration} minutes. You cannot pause once started.`)) return;
    currentExamId = examId;
    const res = await fetch(`${API}/question/student/${examId}`);
    const questions = await res.json();
    if (questions.length === 0) { alert("No questions added to this exam yet!"); return; }

    document.getElementById('mainContent').style.display = 'none';
    document.querySelector('.hero-section').style.display = 'none';
    document.getElementById('examScreen').style.display = 'block';
    document.getElementById('examScreenTitle').innerText = title;
    document.getElementById('examProgress').innerText = `0/${questions.length}`;

    document.getElementById('examQuestionsArea').innerHTML = questions.map((q, i) =>
        `<div class="question-card fade-in" style="animation-delay:${i * 0.05}s">
            <div class="d-flex justify-content-between mb-2"><span class="badge bg-primary">Q${i + 1}</span><span class="text-muted small">${q.marks || 1} mark(s)</span></div>
            <h5 class="mb-3">${q.questionText}</h5>
            <label class="option-label"><input type="radio" name="q${q.id}" value="A" onchange="updateProgress(${questions.length})"><span>A) ${q.optionA}</span></label>
            <label class="option-label"><input type="radio" name="q${q.id}" value="B" onchange="updateProgress(${questions.length})"><span>B) ${q.optionB}</span></label>
            <label class="option-label"><input type="radio" name="q${q.id}" value="C" onchange="updateProgress(${questions.length})"><span>C) ${q.optionC}</span></label>
            <label class="option-label"><input type="radio" name="q${q.id}" value="D" onchange="updateProgress(${questions.length})"><span>D) ${q.optionD}</span></label>
        </div>`).join('') + '<div class="text-center mb-5"><button class="btn btn-danger btn-lg px-5" onclick="submitExam()">Submit Exam</button></div>';

    // Start timer
    examTimeLeft = duration * 60;
    updateTimerDisplay();
    examTimer = setInterval(() => {
        examTimeLeft--;
        updateTimerDisplay();
        if (examTimeLeft <= 0) { clearInterval(examTimer); alert("Time's up!"); submitExam(); }
    }, 1000);
}

function updateTimerDisplay() {
    const m = Math.floor(examTimeLeft / 60), s = examTimeLeft % 60;
    const el = document.getElementById('examTimer');
    el.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (examTimeLeft < 60) el.classList.add('pulse');
}

function updateProgress(total) {
    const answered = document.querySelectorAll('#examQuestionsArea input[type=radio]:checked').length;
    document.getElementById('examProgress').innerText = `${answered}/${total}`;
}

async function submitExam() {
    if (!confirm("Are you sure you want to submit?")) return;
    clearInterval(examTimer);
    const answers = {};
    document.querySelectorAll('#examQuestionsArea input[type=radio]:checked').forEach(r => {
        const qId = r.name.replace('q', '');
        answers[qId] = r.value;
    });
    try {
        const res = await fetch(`${API}/result/submit?studentId=${currentUser.id}&examId=${currentExamId}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(answers)
        });
        if (!res.ok) throw new Error(await res.text());
        const result = await res.json();
        alert(`Exam Submitted!\nScore: ${result.marksObtained}/${result.totalMarks} (${result.percentage}%)\nStatus: ${result.status}`);
        document.getElementById('examScreen').style.display = 'none';
        document.querySelector('.hero-section').style.display = '';
        document.getElementById('mainContent').style.display = 'block';
        showPanel('myResults');
    } catch (err) { alert("Submit error: " + err.message); }
}

// ===== ADMIN: Manage Exams =====
async function renderAdminExams() {
    await loadDepartments();
    const area = document.getElementById('contentArea');
    area.innerHTML = `<div class="row fade-in"><div class="col-md-5"><div class="card glass-card p-4"><h5 class="mb-3">Create / Edit Exam</h5>
        <form id="examForm"><input type="hidden" id="exam-id">
        <div class="mb-2"><input type="text" class="form-control" id="exam-title" placeholder="Exam Title" required></div>
        <div class="mb-2"><input type="text" class="form-control" id="exam-subject" placeholder="Subject" required></div>
        <div class="row mb-2"><div class="col"><input type="number" class="form-control" id="exam-marks" placeholder="Max Marks" required></div>
        <div class="col"><input type="number" class="form-control" id="exam-qs" placeholder="Questions" required></div></div>
        <div class="row mb-2"><div class="col"><select class="form-select" id="exam-dept"></select></div>
        <div class="col"><select class="form-select" id="exam-sem"><option value="">Semester</option>${[1, 2, 3, 4, 5, 6, 7, 8].map(s => `<option value="${s}">Sem ${s}</option>`).join('')}</select></div></div>
        <div class="row mb-2"><div class="col"><input type="number" class="form-control" id="exam-duration" placeholder="Duration (min)" value="30"></div>
        <div class="col"><input type="number" class="form-control" id="exam-pass" placeholder="Pass %" value="40"></div></div>
        <textarea class="form-control mb-2" id="exam-desc" placeholder="Description" rows="2"></textarea>
        <button type="submit" id="examBtn" class="btn btn-success w-100">Save Exam</button></form></div></div>
        <div class="col-md-7"><div class="card glass-card p-4"><h5 class="mb-3">All Exams</h5><div id="adminExamsList"></div></div></div></div>`;
    populateDeptSelect('exam-dept');
    document.getElementById('examForm').addEventListener('submit', saveExam);
    loadAdminExams();
}

async function saveExam(e) {
    e.preventDefault();
    const deptId = document.getElementById('exam-dept').value;
    const data = {
        title: document.getElementById('exam-title').value, subject: document.getElementById('exam-subject').value,
        maxMarks: document.getElementById('exam-marks').value, numberOfQuestions: document.getElementById('exam-qs').value,
        description: document.getElementById('exam-desc').value, active: true, semester: document.getElementById('exam-sem').value,
        durationMinutes: parseInt(document.getElementById('exam-duration').value) || 30,
        passingPercentage: parseFloat(document.getElementById('exam-pass').value) || 40,
        department: deptId ? { id: parseInt(deptId) } : null
    };
    const id = document.getElementById('exam-id').value;
    if (id) data.id = parseInt(id);
    try {
        const res = await fetch(`${API}/exam/admin/`, { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(await res.text());
        document.getElementById('examForm').reset(); document.getElementById('exam-id').value = '';
        document.getElementById('examBtn').innerText = 'Save Exam';
        loadAdminExams();
    } catch (err) { alert("Save Error: " + err.message); }
}

async function loadAdminExams() {
    const res = await fetch(`${API}/exam/`);
    const data = await res.json();
    document.getElementById('adminExamsList').innerHTML = data.map(e => `<div class="border rounded p-3 mb-2" style="border-color:var(--border)!important">
        <div class="d-flex justify-content-between align-items-center"><div><strong>${e.title}</strong><br><small class="text-muted">${e.subject} | ${e.department?.name || 'No Dept'} | Sem ${e.semester || '-'} | ${e.durationMinutes}min</small></div>
        <div class="d-flex gap-1"><span class="badge ${e.active ? 'bg-success' : 'bg-secondary'}">${e.active ? 'Active' : 'Inactive'}</span>
        <button class="btn btn-sm btn-info" onclick='editExam(${JSON.stringify(e).replace(/'/g, "&#39;")})'>Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteExam(${e.id})">Del</button></div></div></div>`).join('') || '<p class="text-muted">No exams yet.</p>';
}

function editExam(e) {
    document.getElementById('exam-id').value = e.id;
    document.getElementById('exam-title').value = e.title;
    document.getElementById('exam-subject').value = e.subject;
    document.getElementById('exam-marks').value = e.maxMarks;
    document.getElementById('exam-qs').value = e.numberOfQuestions;
    document.getElementById('exam-desc').value = e.description || '';
    document.getElementById('exam-sem').value = e.semester || '';
    document.getElementById('exam-duration').value = e.durationMinutes || 30;
    document.getElementById('exam-pass').value = e.passingPercentage || 40;
    if (e.department) document.getElementById('exam-dept').value = e.department.id;
    document.getElementById('examBtn').innerText = 'Update Exam';
}

async function deleteExam(id) {
    if (confirm("Delete this exam?")) { await fetch(`${API}/exam/admin/${id}`, { method: 'DELETE' }); loadAdminExams(); }
}

// ===== ADMIN: Manage Questions =====
async function renderManageQuestions() {
    const area = document.getElementById('contentArea');
    const exRes = await fetch(`${API}/exam/`);
    const exams = await exRes.json();
    area.innerHTML = `<div class="card glass-card p-4 fade-in"><h4 class="mb-3"><i class="bi bi-question-circle me-2"></i>Manage Questions</h4>
        <div class="row mb-3"><div class="col-md-4"><select class="form-select" id="qExamSelect" onchange="loadQuestionsForExam()">
        <option value="">Select Exam</option>${exams.map(e => `<option value="${e.id}">${e.title} (${e.subject})</option>`).join('')}</select></div>
        <div class="col-md-4"><button class="btn btn-success" onclick="showAddQuestionForm()"><i class="bi bi-plus-circle me-1"></i>Add Question</button></div></div>
        <div id="addQuestionArea" style="display:none"></div>
        <div id="questionsList"></div></div>`;
}

function showAddQuestionForm() {
    const examId = document.getElementById('qExamSelect').value;
    if (!examId) { alert("Select an exam first!"); return; }
    document.getElementById('addQuestionArea').style.display = 'block';
    document.getElementById('addQuestionArea').innerHTML = `<div class="card p-3 mb-3" style="border-color:var(--primary)!important">
        <h6>Add New MCQ Question</h6><form id="addQForm">
        <div class="mb-2"><textarea class="form-control" id="nq-text" placeholder="Question text..." rows="2" required></textarea></div>
        <div class="row mb-2"><div class="col-6"><input class="form-control" id="nq-a" placeholder="Option A" required></div><div class="col-6"><input class="form-control" id="nq-b" placeholder="Option B" required></div></div>
        <div class="row mb-2"><div class="col-6"><input class="form-control" id="nq-c" placeholder="Option C" required></div><div class="col-6"><input class="form-control" id="nq-d" placeholder="Option D" required></div></div>
        <div class="row mb-2"><div class="col-6"><select class="form-select" id="nq-correct" required><option value="">Correct Answer</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div>
        <div class="col-6"><input type="number" class="form-control" id="nq-marks" placeholder="Marks" value="1"></div></div>
        <button type="submit" class="btn btn-primary">Add Question</button> <button type="button" class="btn btn-secondary" onclick="document.getElementById('addQuestionArea').style.display='none'">Cancel</button>
        </form></div>`;
    document.getElementById('addQForm').addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const data = {
            questionText: document.getElementById('nq-text').value, optionA: document.getElementById('nq-a').value,
            optionB: document.getElementById('nq-b').value, optionC: document.getElementById('nq-c').value, optionD: document.getElementById('nq-d').value,
            correctAnswer: document.getElementById('nq-correct').value, marks: parseInt(document.getElementById('nq-marks').value) || 1
        };
        try {
            const res = await fetch(`${API}/question/admin/${examId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error(await res.text());
            document.getElementById('addQForm').reset(); loadQuestionsForExam(); alert("Question added!");
        } catch (err) { alert("Error: " + err.message); }
    });
}

async function loadQuestionsForExam() {
    const examId = document.getElementById('qExamSelect').value;
    if (!examId) { document.getElementById('questionsList').innerHTML = ''; return; }
    const res = await fetch(`${API}/question/admin/${examId}`);
    const qs = await res.json();
    document.getElementById('questionsList').innerHTML = qs.length === 0 ? '<p class="text-muted">No questions yet.</p>' :
        qs.map((q, i) => `<div class="question-card fade-in"><div class="d-flex justify-content-between">
            <span class="badge bg-primary">Q${i + 1} (${q.marks} mark)</span>
            <div><button class="btn btn-sm btn-danger" onclick="deleteQuestion(${q.id})"><i class="bi bi-trash"></i></button></div></div>
            <h6 class="mt-2">${q.questionText}</h6>
            <div class="row mt-2"><div class="col-6"><small class="${q.correctAnswer === 'A' ? 'text-success fw-bold' : 'text-muted'}">A) ${q.optionA}</small></div>
            <div class="col-6"><small class="${q.correctAnswer === 'B' ? 'text-success fw-bold' : 'text-muted'}">B) ${q.optionB}</small></div>
            <div class="col-6"><small class="${q.correctAnswer === 'C' ? 'text-success fw-bold' : 'text-muted'}">C) ${q.optionC}</small></div>
            <div class="col-6"><small class="${q.correctAnswer === 'D' ? 'text-success fw-bold' : 'text-muted'}">D) ${q.optionD}</small></div></div>
            <small class="text-success mt-1 d-block">✓ Correct: ${q.correctAnswer}</small></div>`).join('');
}

async function deleteQuestion(id) {
    if (confirm("Delete this question?")) { await fetch(`${API}/question/admin/${id}`, { method: 'DELETE' }); loadQuestionsForExam(); }
}

// ===== ADMIN: Manage Students =====
async function renderManageStudents() {
    const area = document.getElementById('contentArea');
    area.innerHTML = `<div class="card glass-card p-4 fade-in"><h4 class="mb-3"><i class="bi bi-people-fill me-2"></i>All Students</h4>
        <div class="table-responsive"><table class="table"><thead><tr><th>Reg No</th><th>Name</th><th>Email</th><th>Dept</th><th>Sem</th><th>Actions</th></tr></thead>
        <tbody id="studentTableBody"></tbody></table></div></div>`;
    const res = await fetch(`${API}/user/students`);
    const students = await res.json();
    document.getElementById('studentTableBody').innerHTML = students.map(s => `<tr>
        <td><span class="badge bg-light text-dark">${s.registrationNumber || '-'}</span></td>
        <td class="fw-semibold">${s.firstName} ${s.lastName}</td><td>${s.email}</td>
        <td>${s.department?.name || '-'}</td><td>${s.semester || '-'}</td>
        <td><button class="btn btn-sm btn-warning" onclick="viewStudentDetail(${s.id})">View</button>
        <button class="btn btn-sm btn-danger ms-1" onclick="deleteStudent(${s.id})">Del</button></td></tr>`).join('') || '<tr><td colspan="6" class="text-center text-muted">No students</td></tr>';
}

async function viewStudentDetail(id) {
    const sRes = await fetch(`${API}/user/${id}`);
    const s = await sRes.json();
    const rRes = await fetch(`${API}/result/student/${id}`);
    const results = await rRes.json();
    const eRes = await fetch(`${API}/exam/student/registrations/${id}`);
    const enrollments = await eRes.json();
    const area = document.getElementById('contentArea');
    area.innerHTML = `<div class="fade-in"><button class="btn btn-outline-primary btn-sm mb-3" onclick="renderManageStudents()"><i class="bi bi-arrow-left me-1"></i>Back</button>
        <div class="card glass-card p-4 mb-3"><h5>${s.firstName} ${s.lastName}</h5>
        <div class="row"><div class="col-md-3"><div class="stat-card"><h3>${s.registrationNumber || '-'}</h3><p>Reg No</p></div></div>
        <div class="col-md-3"><div class="stat-card"><h3>${s.department?.name || '-'}</h3><p>Department</p></div></div>
        <div class="col-md-3"><div class="stat-card"><h3>Sem ${s.semester || '-'}</h3><p>Semester</p></div></div>
        <div class="col-md-3"><div class="stat-card"><h3>${results.length}</h3><p>Exams Taken</p></div></div></div></div>
        <div class="card glass-card p-4 mb-3"><h5>Enrollments</h5><div class="table-responsive"><table class="table"><thead><tr><th>Exam</th><th>Date</th><th>Status</th><th>Score</th></tr></thead><tbody>
        ${enrollments.map(en => `<tr><td>${en.exam.title}</td><td>${en.examDate || 'Pending'}</td><td><span class="badge ${en.status === 'COMPLETED' ? 'bg-success' : 'bg-warning text-dark'}">${en.status}</span></td>
        <td>${en.score != null ? en.score : '-'}</td></tr>`).join('') || '<tr><td colspan="4" class="text-muted text-center">No enrollments</td></tr>'}</tbody></table></div></div>
        <div class="card glass-card p-4"><h5>Answer Sheets & Results</h5>
        ${results.map(r => `<div class="question-card ${r.status === 'PASSED' ? 'result-pass' : 'result-fail'} mb-3">
            <div class="d-flex justify-content-between"><h6>${r.exam.title}</h6><span class="badge ${r.status === 'PASSED' ? 'bg-success' : 'bg-danger'}">${r.status} - ${r.percentage}%</span></div>
            <div class="row mt-2"><div class="col-3"><small class="text-muted">Score: <strong>${r.marksObtained}/${r.totalMarks}</strong></small></div>
            <div class="col-3"><small class="text-muted">Correct: <strong>${r.correctAnswers}</strong></small></div>
            <div class="col-3"><small class="text-muted">Wrong: <strong>${r.wrongAnswers}</strong></small></div>
            <div class="col-3"><small class="text-muted">Attempted: <strong>${r.attemptedQuestions}/${r.totalQuestions}</strong></small></div></div>
            <button class="btn btn-sm btn-info mt-2" onclick="viewAnswerSheet(${r.exam.id}, ${s.id})">View Answer Sheet</button>
            </div>`).join('') || '<p class="text-muted">No exam results yet.</p>'}</div></div>`;
}

async function viewAnswerSheet(examId, studentId) {
    const qRes = await fetch(`${API}/question/admin/${examId}`);
    const questions = await qRes.json();
    const rRes = await fetch(`${API}/result/check?studentId=${studentId}&examId=${examId}`);
    const result = await rRes.json();
    let answers = {};
    try { answers = JSON.parse(result.answersJson || '{}'); } catch (e) { }

    let html = `<div class="card glass-card p-4 fade-in"><div class="d-flex justify-content-between mb-3"><h5>Answer Sheet</h5>
        <span class="badge ${result.status === 'PASSED' ? 'bg-success' : 'bg-danger'} fs-6">${result.marksObtained}/${result.totalMarks} (${result.percentage}%)</span></div>`;
    questions.forEach((q, i) => {
        const studentAns = answers[String(q.id)] || 'Not Answered';
        const isCorrect = studentAns === q.correctAnswer;
        html += `<div class="question-card mb-2" style="border-left:4px solid ${isCorrect ? 'var(--success)' : studentAns === 'Not Answered' ? 'var(--text-muted)' : 'var(--danger)'}">
            <div class="d-flex justify-content-between"><span class="badge bg-primary">Q${i + 1}</span>
            <span class="badge ${isCorrect ? 'bg-success' : 'bg-danger'}">${isCorrect ? '✓ Correct' : '✗ Wrong'}</span></div>
            <h6 class="mt-2">${q.questionText}</h6>
            <div class="row"><div class="col-6"><small class="${q.correctAnswer === 'A' ? 'text-success fw-bold' : ''} ${studentAns === 'A' && !isCorrect ? 'text-danger text-decoration-line-through' : ''}">A) ${q.optionA}</small></div>
            <div class="col-6"><small class="${q.correctAnswer === 'B' ? 'text-success fw-bold' : ''} ${studentAns === 'B' && !isCorrect ? 'text-danger text-decoration-line-through' : ''}">B) ${q.optionB}</small></div>
            <div class="col-6"><small class="${q.correctAnswer === 'C' ? 'text-success fw-bold' : ''} ${studentAns === 'C' && !isCorrect ? 'text-danger text-decoration-line-through' : ''}">C) ${q.optionC}</small></div>
            <div class="col-6"><small class="${q.correctAnswer === 'D' ? 'text-success fw-bold' : ''} ${studentAns === 'D' && !isCorrect ? 'text-danger text-decoration-line-through' : ''}">D) ${q.optionD}</small></div></div>
            <small class="d-block mt-1">Student: <strong class="${isCorrect ? 'text-success' : 'text-danger'}">${studentAns}</strong> | Correct: <strong class="text-success">${q.correctAnswer}</strong></small></div>`;
    });
    html += '</div>';
    const modal = document.createElement('div');
    modal.innerHTML = `<div class="modal fade" tabindex="-1" id="answerSheetModal"><div class="modal-dialog modal-xl"><div class="modal-content"><div class="modal-header"><h5>Answer Sheet Review</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body">${html}</div></div></div></div>`;
    document.body.appendChild(modal);
    new bootstrap.Modal(modal.querySelector('.modal')).show();
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
}

async function deleteStudent(id) {
    if (confirm("Delete this student permanently?")) { await fetch(`${API}/user/${id}`, { method: 'DELETE' }); renderManageStudents(); }
}

// ===== ADMIN: View All Results =====
async function renderViewResults() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<div class="card glass-card p-4 fade-in"><h4 class="mb-3"><i class="bi bi-clipboard-data me-2"></i>All Exam Results</h4><div id="allResultsList"><p class="text-muted">Loading...</p></div></div>';
    const res = await fetch(`${API}/result/all`);
    const data = await res.json();
    document.getElementById('allResultsList').innerHTML = data.length === 0 ? '<p class="text-muted">No results yet.</p>' :
        `<div class="table-responsive"><table class="table"><thead><tr><th>Student</th><th>Exam</th><th>Score</th><th>%</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>` +
        data.map(r => `<tr><td>${r.student.firstName} ${r.student.lastName}</td><td>${r.exam.title}</td>
            <td>${r.marksObtained}/${r.totalMarks}</td><td>${r.percentage}%</td>
            <td><span class="badge ${r.status === 'PASSED' ? 'bg-success' : 'bg-danger'}">${r.status}</span></td>
            <td class="small">${r.submittedAt || '-'}</td>
            <td><button class="btn btn-sm btn-info" onclick="viewAnswerSheet(${r.exam.id}, ${r.student.id})">Sheet</button></td></tr>`).join('') +
        '</tbody></table></div>';
}

// ===== ADMIN: Departments =====
async function renderManageDepts() {
    await loadDepartments();
    const area = document.getElementById('contentArea');
    area.innerHTML = `<div class="card glass-card p-4 fade-in"><h4 class="mb-3"><i class="bi bi-building me-2"></i>Departments</h4>
        <form id="deptForm" class="row mb-3"><div class="col-4"><input class="form-control" id="dept-name" placeholder="Name" required></div>
        <div class="col-3"><input class="form-control" id="dept-code" placeholder="Code" required></div>
        <div class="col-3"><input class="form-control" id="dept-desc" placeholder="Description"></div>
        <div class="col-2"><button class="btn btn-success w-100">Add</button></div></form>
        <div id="deptList"></div></div>`;
    document.getElementById('deptForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = { name: document.getElementById('dept-name').value, code: document.getElementById('dept-code').value, description: document.getElementById('dept-desc').value };
        await fetch(`${API}/department/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        document.getElementById('deptForm').reset(); renderManageDepts();
    });
    document.getElementById('deptList').innerHTML = departments.map(d => `<div class="d-flex justify-content-between align-items-center border rounded p-2 mb-2" style="border-color:var(--border)!important">
        <div><strong>${d.name}</strong> <span class="badge bg-primary ms-2">${d.code}</span><br><small class="text-muted">${d.description || ''}</small></div>
        <button class="btn btn-sm btn-danger" onclick="deleteDept(${d.id})">Delete</button></div>`).join('');
}

async function deleteDept(id) {
    if (confirm("Delete department?")) { await fetch(`${API}/department/${id}`, { method: 'DELETE' }); renderManageDepts(); }
}
