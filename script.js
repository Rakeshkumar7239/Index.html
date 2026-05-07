const state = JSON.parse(localStorage.getItem("cmsData")) || {
  students: [],
  courses: [],
  enrollments: []
};

const studentForm = document.getElementById("studentForm");
const courseForm = document.getElementById("courseForm");
const enrollForm = document.getElementById("enrollForm");
const clearDataBtn = document.getElementById("clearData");

const studentList = document.getElementById("studentList");
const courseList = document.getElementById("courseList");
const enrollmentList = document.getElementById("enrollmentList");

const studentSelect = document.getElementById("studentSelect");
const courseSelect = document.getElementById("courseSelect");

const persist = () => {
  localStorage.setItem("cmsData", JSON.stringify(state));
};

const renderList = (element, items, mapFn, emptyText) => {
  element.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = emptyText;
    element.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = mapFn(item);
    element.appendChild(li);
  });
};

const renderSelect = (select, items, labelFn, placeholder) => {
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholder;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = labelFn(item);
    select.appendChild(option);
  });

  select.disabled = !items.length;
};

const render = () => {
  renderList(
    studentList,
    state.students,
    (s) => `${s.name} (${s.email})`,
    "No students added yet."
  );

  renderList(
    courseList,
    state.courses,
    (c) => `${c.name} [${c.code}]`,
    "No courses added yet."
  );

  renderList(
    enrollmentList,
    state.enrollments,
    (e) => {
      const student = state.students.find((s) => s.id === e.studentId);
      const course = state.courses.find((c) => c.id === e.courseId);
      return `${student?.name || "Unknown Student"} → ${course?.name || "Unknown Course"}`;
    },
    "No enrollments added yet."
  );

  renderSelect(studentSelect, state.students, (s) => s.name, "Select Student");
  renderSelect(courseSelect, state.courses, (c) => `${c.name} (${c.code})`, "Select Course");
};

studentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim();

  if (!name || !email) return;

  state.students.push({ id: crypto.randomUUID(), name, email });
  persist();
  studentForm.reset();
  render();
});

courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("courseName").value.trim();
  const code = document.getElementById("courseCode").value.trim().toUpperCase();

  if (!name || !code) return;

  state.courses.push({ id: crypto.randomUUID(), name, code });
  persist();
  courseForm.reset();
  render();
});

enrollForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const studentId = studentSelect.value;
  const courseId = courseSelect.value;

  const duplicate = state.enrollments.some(
    (entry) => entry.studentId === studentId && entry.courseId === courseId
  );

  if (!studentId || !courseId || duplicate) return;

  state.enrollments.push({ id: crypto.randomUUID(), studentId, courseId });
  persist();
  enrollForm.reset();
  render();
});

clearDataBtn.addEventListener("click", () => {
  state.students = [];
  state.courses = [];
  state.enrollments = [];
  persist();
  render();
});

render();
