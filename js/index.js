// Функція для отримання всіх студентів
const getAllStudentsBtn = document.querySelector("#get-students-btn");
const hideAllStudentsBtn = document.querySelector("#hide-students-btn");
const formToAdd = document.querySelector("#add-student-form");
const tableStudents = document.querySelector("#students-table");
const tbodylist = document.querySelector("#tbodyList");
const inputName = document.querySelector("#name");
const inputAge = document.querySelector("#age");
const inputCourse = document.querySelector("#course");
const inputSkills = document.querySelector("#skills");
const inputEmail = document.querySelector("#email");
const inputIsEnrolled = document.querySelector("#isEnrolled");
const deleteStudentBtn = document.querySelectorAll("#deleteStudent");
const addStudentBtn = document.querySelector(".addStudentBtn");
const updateStudentBtn = document.querySelector(".updateStudentBtn");

let studentsArr = [];

function getStudents() {
  fetch("http://localhost:1000/students")
    .then((response) => response.json())
    .then((students) => {
      studentsArr = students;
      renderStudents(students);
    })
    .catch((e) => console.log(e));
}

getAllStudentsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getStudents();
  hideAllStudentsBtn.style.display = "block";
  getAllStudentsBtn.style.display = "none";
});

hideAllStudentsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  tbodylist.innerHTML = "";
  getAllStudentsBtn.style.display = "block";
  hideAllStudentsBtn.style.display = "none";
});

// Функція для відображення студентів у таблиці

function renderStudents(students) {
  tbodylist.innerHTML = "";
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${student.id}</td>
<td>${student.name}</td>
<td>${student.age}</td>
<td>${student.course}</td>
<td>${student.skills}</td>
<td>${student.email}</td>
<td>${student.isEnrolled}</td>
<td><button class='delete-student' id='deleteStudent'>Видалити</button>
<button class='change-student' id='changeStudent'>Редагувати</button></td>
`;
    tbodylist.appendChild(row);
  });
}

// Функція для додавання нового студента

function addStudent(e) {
  e.preventDefault();
  const newStudent = {
    name: inputName.value,
    age: parseInt(inputAge.value),
    course: inputCourse.value,
    skills: inputSkills.value.split(',').map(skill => skill.trim()),
    email: inputEmail.value,
    isEnrolled: inputIsEnrolled.checked,
  };
  fetch("http://localhost:1000/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStudent),
  })
    .then((response) => response.json())
    .then(() => {
      formToAdd.reset();
      getStudents();
    })
    .catch((error) => console.error("Error:", error));
}

formToAdd.addEventListener("submit", addStudent);

// Функція для видалення студента
function deleteStudent(e) {
  // e.preventDefault();
  const closestStudent = e.target.closest("tr");
  const studentId = closestStudent.querySelector("td").textContent;

  fetch(`http://localhost:1000/students/${studentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      studentsArr = studentsArr.filter((el) => {
        el.id !== Number(studentId);
      });
      getStudents();
      closestStudent.remove();
    })
    .catch((error) => console.error("Error:", error));
}

tbodylist.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("delete-student")) {
    deleteStudent(e);
  }
});

// Функція для оновлення студента

function updateStudent(e) {
  addStudentBtn.style.display = "none";
  updateStudentBtn.style.display = "block";
  const closestStudent = e.target.closest("tr");
  const studentId = closestStudent.querySelector("td").textContent;
  console.log("studen is", studentId);

  const studentData = {
    id: Number(studentId),
    name: closestStudent.children[1].textContent.trim(),
    age: closestStudent.children[2].textContent.trim(),
    course: closestStudent.children[3].textContent.trim(),
    skills: closestStudent.children[4].textContent.trim(),
    email: closestStudent.children[5].textContent.trim(),
    isEnrolled: closestStudent.children[6].textContent.trim() === "true",
  };

  inputName.value = studentData.name;
  inputAge.value = studentData.age;
  inputCourse.value = studentData.course;
  inputSkills.value = studentData.skills;
  inputEmail.value = studentData.email;
  inputIsEnrolled.checked = studentData.isEnrolled;

  updateStudentBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const changedStudent = {
      id: studentData.id,
      name: inputName.value,
      age: parseInt(inputAge.value),
      course: inputCourse.value,
      skills: inputSkills.value,
      email: inputEmail.value,
      isEnrolled: inputIsEnrolled.checked,
    };

    fetch(`http://localhost:1000/students/${studentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changedStudent),
    })
      .then(() => {
        formToAdd.reset();
        getStudents();
        addStudentBtn.style.display = "block";
        updateStudentBtn.style.display = "none";
      })
      .catch((error) => console.error("Error:", error));
  });
}

tbodylist.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("change-student")) {
    updateStudent(e);
  }
});
