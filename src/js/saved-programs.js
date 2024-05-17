let uuid;
const url = "https://jlgsxiynwqvvhwheexwo.supabase.co/rest/v1/user-data";
const api =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZ3N4aXlud3F2dmh3aGVleHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0NzA5MjksImV4cCI6MjAzMDA0NjkyOX0.U40ZZWRh_MC7612vdwFHVKFZxwRHq_TECCnnzovEXKE";

if (localStorage.getItem("uuid")) {
  uuid = localStorage.getItem("uuid");
} else {
  uuid = sessionStorage.getItem("uuid");
}

const userData = await fetch(url + `?id=eq.${uuid}`, {
  method: "GET",
  headers: { apikey: api },
}).then((res) => {
  if (!res.ok) {
    window.location.href = "/";
  }
  return res.json();
});

let obj;

const parentElement = document.querySelector(".program-list");
const template = document.querySelector(".card-template").content;

if (userData[0].saved_programs) {
  userData[0].saved_programs.map((data) => {
    const myClone = template.cloneNode(true);
    myClone
      .querySelector(".program-card")
      .setAttribute("data-card-id", data.programId);
    myClone.querySelector(".program-title").textContent = data.programTitle;
    if (data.programDescription) {
      myClone.querySelector(".program-description").textContent =
        data.programDescription;
    }
    myClone.querySelector(".edit").setAttribute("id", `edit-${data.programId}`);
    myClone
      .querySelector(".set-goal")
      .setAttribute("id", `set-goal-${data.programId}`);
    myClone
      .querySelector(".delete")
      .setAttribute("id", `delete-${data.programId}`);
    myClone
      .querySelector(".program-image")
      .setAttribute(
        "src",
        `../assets/images/${data.programList[0][0].slice(0, 3)}.webp`
      );
    myClone
      .getElementById(`edit-${data.programId}`)
      .addEventListener("mousedown", () => {
        window.location.href = `/lav-dit-program`;
        sessionStorage.setItem(
          "program-list",
          JSON.stringify(data.programList)
        );
        sessionStorage.setItem("program-id", data.programId);
        sessionStorage.setItem("program-title", data.programTitle);
        sessionStorage.setItem("program-description", data.programDescription);
      });
    myClone
      .getElementById(`set-goal-${data.programId}`)
      .addEventListener("mousedown", () => {
        document.querySelector(".goal-modal").showModal();
        sessionStorage.setItem("program-id", data.programId);
        sessionStorage.setItem("program-title", data.programTitle);
        sessionStorage.setItem("program-list", data.programList);
      });
    myClone
      .getElementById(`delete-${data.programId}`)
      .addEventListener("mousedown", () => {
        const index = userData[0].saved_programs.findIndex(
          (item) => item.programId === data.programId
        );
        userData[0].saved_programs.splice(index, 1);
        obj = {
          saved_programs: userData[0].saved_programs,
        };
        saveProgram(obj);
      });
    parentElement.appendChild(myClone);
  });
}

//patching program liste
async function saveProgram(program) {
  fetch(
    `https://jlgsxiynwqvvhwheexwo.supabase.co/rest/v1/user-data?id=eq.${uuid}`,
    {
      method: "PATCH",
      body: JSON.stringify(program),
      headers: {
        apikey: api,
        Prefer: "return=representation",
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      location.reload();
    });
}

let item;
let goalId;
let goalProgram;
let goalProgramList;

document.querySelector(".back-button").addEventListener("mousedown", () => {
  document.querySelector(".goal-modal").close();
});

const form = document.getElementById("goal-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  goalId = sessionStorage.getItem("program-id");
  goalProgram = sessionStorage.getItem("program-title");
  goalProgramList = sessionStorage.getItem("program-list");

  if (
    userData[0].goals &&
    userData[0].goals.findIndex((item) => item.programId === goalId) > -1
  ) {
    const index = userData[0].goals.findIndex(
      (item) => item.programId === goalId
    );
    userData[0].goals.splice(index, 1);
  }
  if (userData[0].goals) {
    item = {
      goals: userData[0].goals.concat([
        {
          programId: goalId,
          goalTitle: goalProgram,
          goalProgramList: goalProgramList,
          goalNumber: form.elements.goal_setting.value,
          startDate: form.elements.goal_start.value,
          endDate: form.elements.goal_end.value,
        },
      ]),
    };
  } else {
    item = {
      goals: [
        {
          programId: goalId,
          goalTitle: goalProgram,
          goalProgramList: goalProgramList,
          goalNumber: form.elements.goal_setting.value,
          startDate: form.elements.goal_start.value,
          endDate: form.elements.goal_end.value,
        },
      ],
    };
  }
  saveGoal(item);
});

//patching program liste
async function saveGoal(program) {
  fetch(
    `https://jlgsxiynwqvvhwheexwo.supabase.co/rest/v1/user-data?id=eq.${uuid}`,
    {
      method: "PATCH",
      body: JSON.stringify(program),
      headers: {
        apikey: api,
        Prefer: "return=representation",
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      document.querySelector(".goal-modal").close();
    });
}
