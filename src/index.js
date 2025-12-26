import "./styles.css";
import { Task, Project, ProjectsList } from "./to-do.js";
import editIcon from "./images/pencil-outline.svg";
import deleteIcon from "./images/trash-can-outline.svg";
import { format, parse, formatISO } from "date-fns";

const projectsList = new ProjectsList();

const projectsSection = document.getElementById("projects-section");
const addNewProjectBtn = document.getElementById("add-new-project");
const addNewProjectModal = document.getElementById("add-new-project-modal");
const projectTitleInput = document.getElementById("project-title-input");
const cancelProject = document.getElementById("cancel-project");
const confirmProject = document.getElementById("confirm-project");

const createProjectEl = (project) => {
  const projectEl = document.createElement("div");
  projectEl.id = project.id;
  projectEl.className = "project";
  projectsSection.insertBefore(projectEl, addNewProjectBtn);
  projectEl.addEventListener("click", () => selectProject(project.id));

  const titleHeading = document.createElement("div");
  titleHeading.textContent = project.title;

  const editBtn = document.createElement("button");
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    projectTitleInput.value = titleHeading.textContent;
    addNewProjectModal.showModal();
    cancelProject.addEventListener(
      "click",
      () => {
        addNewProjectModal.close();
      },
      { once: true }
    );
    confirmProject.addEventListener(
      "click",
      () => {
        project.edit(projectTitleInput.value);
        titleHeading.textContent = projectTitleInput.value;
        addNewProjectModal.close();
        localStorage.setItem(
          "projectsList",
          JSON.stringify(projectsList.projectsList)
        );
      },
      { once: true }
    );
  });
  editBtn.className = "icon-btn";
  const editBtnImg = document.createElement("img");
  editBtnImg.src = editIcon;
  editBtn.appendChild(editBtnImg);

  const deleteBtn = document.createElement("button");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (projectsList.projectsList.length > 1) {
      projectsList.deleteProject(project.id);
      if (projectEl === selectedProjectEl) {
        selectProject(projectsList.projectsList[0].id);
      }
      projectEl.remove();
    }
  });
  deleteBtn.className = "icon-btn";
  const deleteBtnImg = document.createElement("img");
  deleteBtnImg.src = deleteIcon;
  deleteBtn.appendChild(deleteBtnImg);

  projectEl.appendChild(titleHeading);
  projectEl.appendChild(editBtn);
  projectEl.appendChild(deleteBtn);
};

const createProject = (title, id = "") => {
  const project = new Project(title, id);
  projectsList.addProject(project);

  createProjectEl(project);
};

addNewProjectBtn.addEventListener("click", () => {
  projectTitleInput.value = "";
  addNewProjectModal.showModal();
  cancelProject.addEventListener(
    "click",
    () => {
      addNewProjectModal.close();
    },
    { once: true }
  );
  confirmProject.addEventListener(
    "click",
    () => {
      createProject(projectTitleInput.value);
      addNewProjectModal.close();
      localStorage.setItem(
        "projectsList",
        JSON.stringify(projectsList.projectsList)
      );
    },
    { once: true }
  );
});

const tasksHeading = document.getElementById("tasks-heading");

let selectedProjectEl = null;
const selectProject = (id) => {
  localStorage.setItem("selectedProjectId", id);

  selectedProjectEl?.classList.remove("selected");
  selectedProjectEl = document.getElementById(id);
  selectedProjectEl.classList.add("selected");

  const selectedProject = projectsList.findProject(selectedProjectEl.id);
  tasksHeading.textContent = `${selectedProject.title} Tasks`;

  const oldTaskEls = document.querySelectorAll(".task");
  oldTaskEls.forEach((el) => el.remove());
  selectedProject.tasksList.forEach((task) =>
    createTaskEl(task, selectedProject)
  );
};

const tasksSection = document.getElementById("tasks-section");
const addNewTaskModal = document.getElementById("add-new-task-modal");
const taskTitleInput = document.getElementById("task-title-input");
const taskDescriptionInput = document.getElementById("task-description-input");
const dueDateInput = document.getElementById("due-date-input");
const priorityInput = document.getElementById("priority-input");
const cancelTask = document.getElementById("cancel-task");
const confirmTask = document.getElementById("confirm-task");

const createTaskEl = (task, project) => {
  const taskEl = document.createElement("div");
  tasksSection.appendChild(taskEl);
  taskEl.className = "task";

  const topDiv = document.createElement("div");
  const checkboxInput = document.createElement("input");
  checkboxInput.type = "checkbox";
  checkboxInput.checked = task.done;
  const titleHeading = document.createElement("h2");
  titleHeading.textContent = task.title;
  const dueDateSpan = document.createElement("span");
  dueDateSpan.textContent = task.dueDate;
  topDiv.appendChild(checkboxInput);
  topDiv.appendChild(titleHeading);
  topDiv.appendChild(dueDateSpan);

  const descriptionParagraph = document.createElement("p");
  descriptionParagraph.textContent = task.description;

  const bottomDiv = document.createElement("div");
  const priorityDiv = document.createElement("div");
  const prioritySpan = document.createElement("span");
  prioritySpan.textContent =
    task.priority[0].toUpperCase() + task.priority.slice(1);
  prioritySpan.className = `priority ${task.priority}`;
  priorityDiv.appendChild(prioritySpan);

  const editBtn = document.createElement("button");
  editBtn.addEventListener("click", () => {
    taskTitleInput.value = titleHeading.textContent;
    taskDescriptionInput.value = descriptionParagraph.textContent;
    dueDateInput.value = dueDateSpan.textContent
      ? formatISO(parse(dueDateSpan.textContent, "Pp", new Date())).slice(0, 16)
      : "";
    priorityInput.value =
      prioritySpan.textContent[0].toLowerCase() +
      prioritySpan.textContent.slice(1);
    addNewTaskModal.showModal();
    cancelTask.addEventListener(
      "click",
      () => {
        addNewTaskModal.close();
      },
      { once: true }
    );
    confirmTask.addEventListener(
      "click",
      () => {
        const newDueDate = dueDateInput.value
          ? format(new Date(dueDateInput.value), "Pp")
          : "";
        task.edit(
          taskTitleInput.value,
          taskDescriptionInput.value,
          newDueDate,
          priorityInput.value
        );
        titleHeading.textContent = taskTitleInput.value;
        descriptionParagraph.textContent = taskDescriptionInput.value;
        dueDateSpan.textContent = newDueDate;
        prioritySpan.textContent =
          priorityInput.value[0].toUpperCase() + priorityInput.value.slice(1);
        prioritySpan.className = `priority ${priorityInput.value}`;
        addNewTaskModal.close();
        localStorage.setItem(
          "projectsList",
          JSON.stringify(projectsList.projectsList)
        );
        console.log(localStorage.getItem("projectsList"));
      },
      { once: true }
    );
  });
  editBtn.className = "icon-btn";
  const editBtnImg = document.createElement("img");
  editBtnImg.src = editIcon;
  editBtn.appendChild(editBtnImg);

  const deleteBtn = document.createElement("button");
  deleteBtn.addEventListener("click", () => {
    project.deleteTask(task.id);
    taskEl.remove();
  });
  deleteBtn.className = "icon-btn";
  const deleteBtnImg = document.createElement("img");
  deleteBtnImg.src = deleteIcon;
  deleteBtn.appendChild(deleteBtnImg);

  bottomDiv.appendChild(priorityDiv);
  bottomDiv.appendChild(editBtn);
  bottomDiv.appendChild(deleteBtn);

  taskEl.appendChild(topDiv);
  taskEl.appendChild(descriptionParagraph);
  taskEl.appendChild(bottomDiv);
};

const createTask = (
  title,
  description,
  dueDate,
  priority,
  done = false,
  id = ""
) => {
  const task = new Task(title, description, dueDate, priority, done, id);
  const project = projectsList.findProject(selectedProjectEl.id);
  project.addTask(task);

  createTaskEl(task, project);
};

const addNewTaskBtn = document.getElementById("add-new-task");
addNewTaskBtn.addEventListener("click", () => {
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "low";
  addNewTaskModal.showModal();
  cancelTask.addEventListener(
    "click",
    () => {
      addNewTaskModal.close();
    },
    { once: true }
  );
  confirmTask.addEventListener(
    "click",
    () => {
      createTask(
        taskTitleInput.value,
        taskDescriptionInput.value,
        dueDateInput.value ? format(new Date(dueDateInput.value), "Pp") : "",
        priorityInput.value
      );
      addNewTaskModal.close();
      localStorage.setItem(
        "projectsList",
        JSON.stringify(projectsList.projectsList)
      );
    },
    { once: true }
  );
});

if (localStorage.getItem("projectsList")) {
  const temp = localStorage.getItem("selectedProjectId");
  for (const projectJSON of JSON.parse(localStorage.getItem("projectsList"))) {
    createProject(projectJSON.title, projectJSON.id);
    selectProject(projectsList.projectsList.at(-1).id);
    for (const taskJSON of projectJSON.tasksList) {
      createTask(
        taskJSON.title,
        taskJSON.description,
        taskJSON.dueDate,
        taskJSON.priority,
        taskJSON.done,
        taskJSON.id
      );
    }
  }
  localStorage.setItem("selectedProjectId", temp);
} else {
  createProject("Default");
  localStorage.setItem(
    "projectsList",
    JSON.stringify(projectsList.projectsList)
  );
}

if (localStorage.getItem("selectedProjectId")) {
  selectProject(localStorage.getItem("selectedProjectId"));
} else {
  selectProject(projectsList.projectsList[0].id);
}
