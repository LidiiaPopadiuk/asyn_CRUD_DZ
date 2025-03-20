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

const getStudents = async () => {
  try {
    const response = await fetch("http://localhost:1000/students");
    const data = await response.json();
    studentsArr = data;
    renderStudents(studentsArr);
  } catch (e) {
    console.log(e);
  }
};

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

const renderStudents = (students) => {
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
};

const addStudent = async () => {
  try {
    const newStudent = {
      name: inputName.value,
      age: parseInt(inputAge.value),
      course: inputCourse.value,
      skills: inputSkills.value.split(",").map((skill) => skill.trim()),
      email: inputEmail.value,
      isEnrolled: inputIsEnrolled.checked,
    };
    const fetchAdd = await fetch("http://localhost:1000/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    });
    const resultAddfetch = await fetchAdd.json();
    formToAdd.reset();
    getStudents();
  } catch (e) {
    console.log(e);
  }
};

formToAdd.addEventListener("submit", addStudent);

const deleteStudent = async (e) => {
  try {
    const closestStudent = e.target.closest("tr");
    const studentId = closestStudent.querySelector("td").textContent;

    const fetchDelete = await fetch(
      `http://localhost:1000/students/${studentId}`,
      {
        method: "DELETE",
      }
    );
    studentsArr = studentsArr.filter((el) => {
      el.id !== Number(studentId);
    });
    getStudents();
    closestStudent.remove();
  } catch (e) {
    console.log(e);
  }
};

tbodylist.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("delete-student")) {
    deleteStudent(e);
  }
});

const updateStudent = (e) => {
  try {
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

    updateStudentBtn.addEventListener("click", async (e) => {
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

      const updatefetch = await fetch(
        `http://localhost:1000/students/${studentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changedStudent),
        }
      );
      formToAdd.reset();
      getStudents();
      addStudentBtn.style.display = "block";
      updateStudentBtn.style.display = "none";
    });
  } catch (e) {
    console.log(e);
  }
};

tbodylist.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("change-student")) {
      updateStudent(e);
    }
  });
  
