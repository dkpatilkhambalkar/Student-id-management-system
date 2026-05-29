const users = [
  { username: 'admin@college.edu', password: 'admin123', role: 'admin', name: 'Admin' },
  { username: 'student@college.edu', password: 'student123', role: 'student', name: 'Student User', studentId: 'SID0001' },
];

const students = [
  {
    studentId: 'SID0001',
    fullName: 'Alex Johnson',
    dateOfBirth: '2004-02-14',
    gender: 'Male',
    bloodGroup: 'B+',
    degree: 'B.Tech',
    department: 'Computer Science',
    academicYear: '3',
    admissionYear: '2022',
    contact: '9876543210',
    validUntil: '2027-06-30',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
];

const auditLog = [];
let currentUser = null;
let selectedStudentId = null;

function showPage(pageId) {
  document.querySelectorAll('.page').forEach((p) => p.classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');
}

function addAudit(action, description) {
  auditLog.unshift({ action, user: currentUser?.username ?? 'system', description, at: new Date().toLocaleString() });
  renderAudit();
}

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    document.getElementById('loginError').textContent = 'Invalid credentials.';
    return;
  }

  currentUser = user;
  document.getElementById('loginError').textContent = '';
  document.getElementById('topNav').classList.remove('hidden');
  document.getElementById('loggedInAs').textContent = `Logged in as: ${user.name} (${user.role})`;

  if (user.role === 'admin') {
    showPage('adminDashboard');
    renderStudents();
    updateSummary();
    renderAudit();
  } else {
    showPage('studentDashboard');
    renderStudentDashboard();
  }
}

function logout() {
  currentUser = null;
  document.getElementById('topNav').classList.add('hidden');
  showPage('loginPage');
}

function makeStudentId() {
  const next = students.length + 1;
  return `SID${String(next).padStart(4, '0')}`;
}

function addStudent(event) {
  event.preventDefault();
  const newStudent = {
    studentId: makeStudentId(),
    fullName: fullName.value.trim(),
    dateOfBirth: dateOfBirth.value,
    gender: gender.value,
    bloodGroup: bloodGroup.value.trim(),
    degree: degree.value.trim(),
    department: department.value.trim(),
    academicYear: academicYear.value.trim(),
    admissionYear: admissionYear.value.trim(),
    contact: contact.value.trim(),
    validUntil: validUntil.value,
    status: 'Active',
    createdAt: new Date().toISOString(),
  };

  students.unshift(newStudent);
  event.target.reset();
  addAudit('Student created', `Created ${newStudent.studentId} - ${newStudent.fullName}`);
  renderStudents();
  updateSummary();
}

function filteredStudents() {
  return students.filter((student) => {
    const query = document.getElementById('searchName').value.trim().toLowerCase();
    const matchQuery = !query || student.fullName.toLowerCase().includes(query) || student.studentId.toLowerCase().includes(query);
    const fields = [
      ['filterDegree', student.degree],
      ['filterDepartment', student.department],
      ['filterYear', student.academicYear],
      ['filterGender', student.gender],
      ['filterBlood', student.bloodGroup],
      ['filterAdmissionYear', student.admissionYear],
    ];
    const matchFilters = fields.every(([id, value]) => !document.getElementById(id).value || value.toLowerCase().includes(document.getElementById(id).value.toLowerCase()));
    return matchQuery && matchFilters;
  });
}

function renderStudents() {
  const rows = filteredStudents().map((s) => `
    <tr>
      <td>${s.studentId}</td>
      <td>${s.fullName}</td>
      <td>${s.degree}</td>
      <td>${s.academicYear}</td>
      <td>${s.status}</td>
      <td>
        <button onclick="viewStudent('${s.studentId}')">View</button>
        <button onclick="toggleStatus('${s.studentId}')">${s.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
        <button onclick="generateId('${s.studentId}')">Generate ID</button>
      </td>
    </tr>
  `).join('');

  document.getElementById('studentRows').innerHTML = rows || '<tr><td colspan="6" class="muted">No students found.</td></tr>';
}

function viewStudent(studentId) {
  selectedStudentId = studentId;
  const student = students.find((s) => s.studentId === studentId);
  document.getElementById('idCardPreview').innerHTML = `
    <h4>${student.fullName} (${student.studentId})</h4>
    <p>${student.degree} / ${student.department} / Year ${student.academicYear}</p>
    <p>Blood Group: ${student.bloodGroup} | Contact: ${student.contact}</p>
    <p>Validity: ${student.validUntil}</p>
    <p>Barcode: |||${student.studentId}|||</p>
  `;
}

function generateId(studentId) {
  viewStudent(studentId);
  addAudit('ID generated', `Generated ID for ${studentId}`);
}

function toggleStatus(studentId) {
  const student = students.find((s) => s.studentId === studentId);
  student.status = student.status === 'Active' ? 'Deactivated' : 'Active';
  addAudit('Student updated', `${student.studentId} set to ${student.status}`);
  renderStudents();
  updateSummary();
}

function updateSummary() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('totalStudents').textContent = students.length;
  document.getElementById('activeIds').textContent = students.filter((s) => s.status === 'Active').length;
  document.getElementById('expiredIds').textContent = students.filter((s) => s.validUntil < today).length;
  document.getElementById('recentlyAdded').textContent = students.filter((s) => (Date.now() - new Date(s.createdAt).getTime()) / 86400000 < 7).length;
}

function generateReport(type) {
  const keyMap = { degree: 'degree', year: 'academicYear', blood: 'bloodGroup' };
  const key = keyMap[type];
  const counts = students.reduce((acc, s) => {
    const bucket = s[key] || 'Unknown';
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});

  const reportText = Object.entries(counts).map(([name, count]) => `${name}: ${count}`).join('\n') || 'No data.';
  document.getElementById('reportOutput').textContent = reportText;
  addAudit('Report generated', `${type} report generated`);
}

function renderAudit() {
  const rows = auditLog.map((log) => `<tr><td>${log.action}</td><td>${log.user}</td><td>${log.description}</td><td>${log.at}</td></tr>`).join('');
  document.getElementById('auditRows').innerHTML = rows || '<tr><td colspan="4" class="muted">No activity yet.</td></tr>';
}

function renderStudentDashboard() {
  const student = students.find((s) => s.studentId === currentUser.studentId) || students[0];
  document.getElementById('studentProfile').innerHTML = `
    <p><strong>ID:</strong> ${student.studentId}</p>
    <p><strong>Name:</strong> ${student.fullName}</p>
    <p><strong>Department:</strong> ${student.department}</p>
    <p><strong>Degree:</strong> ${student.degree}</p>
    <p><strong>Status:</strong> ${student.status}</p>
  `;
}

function showStudentIdCard() {
  const student = students.find((s) => s.studentId === currentUser.studentId) || students[0];
  document.getElementById('studentIdCard').innerHTML = `
    <h4>${student.fullName}</h4>
    <p>${student.studentId} | ${student.degree}</p>
    <p>Valid Until: ${student.validUntil}</p>
    <p>Barcode: |||${student.studentId}|||</p>
  `;
}
