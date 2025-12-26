import "./styles.css";
import { Task, Project, ProjectsList } from "./to-do.js";
import editIcon from "./images/pencil-outline.svg";
import deleteIcon from "./images/trash-can-outline.svg";
import { format } from "date-fns";

const projectsList = new ProjectsList();

const projectsSection = document.getElementById("projects-section");
const addNewProjectBtn = document.getElementById("add-new-project");
const addNewProjectModal = document.getElementById("add-new-project-modal");
const projectTitleInput = document.getElementById("project-title-input");
const cancelProject = document.getElementById("cancel-project");
const confirmProject = document.getElementById("confirm-project");

const createProject = (title) => {
  const project = new Project(title);
  projectsList.addProject(project);

  const projectEl = document.createElement("div");
  projectEl.id = project.id;
  projectEl.className = "project";
  projectsSection.insertBefore(projectEl, addNewProjectBtn);
  projectEl.addEventListener("click", () => selectProject(project.id));

  const taskTitle = document.createElement("div");
  taskTitle.textContent = title;

  const editBtn = document.createElement("button");
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    projectTitleInput.value = taskTitle.textContent;
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
        taskTitle.textContent = projectTitleInput.value;
        addNewProjectModal.close();
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

  projectEl.appendChild(taskTitle);
  projectEl.appendChild(editBtn);
  projectEl.appendChild(deleteBtn);
};
createProject("Default");

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
    },
    { once: true }
  );
});

const tasksHeading = document.getElementById("tasks-heading");

let selectedProjectEl = null;
const selectProject = (id) => {
  selectedProjectEl?.classList.remove("selected");
  selectedProjectEl = document.getElementById(id);
  selectedProjectEl.classList.add("selected");
  tasksHeading.textContent = `${
    projectsList.findProject(selectedProjectEl.id).title
  } Tasks`;
};
selectProject(projectsList.projectsList[0].id);

const tasksSection = document.getElementById("tasks-section");
const addNewTaskModal = document.getElementById("add-new-task-modal");
const taskTitleInput = document.getElementById("task-title-input");
const taskDescriptionInput = document.getElementById("task-description-input");
const dueDateInput = document.getElementById("due-date-input");
const priorityInput = document.getElementById("priority-input");
const cancelTask = document.getElementById("cancel-task");
const confirmTask = document.getElementById("confirm-task");

const createTask = (title, description, dueDate, priority) => {
  const task = new Task(title, description, dueDate, priority);
  const project = projectsList.findProject(selectedProjectEl.id);
  project.addTask(task);

  const taskEl = document.createElement("div");
  tasksSection.appendChild(taskEl);
  taskEl.className = "task";

  const topDiv = document.createElement("div");
  const checkboxInput = document.createElement("input");
  checkboxInput.type = "checkbox";
  const titleHeading = document.createElement("h2");
  titleHeading.textContent = title;
  const dueDateSpan = document.createElement("span");
  dueDateSpan.textContent = dueDate;
  topDiv.appendChild(checkboxInput);
  topDiv.appendChild(titleHeading);
  topDiv.appendChild(dueDateSpan);

  const descriptionParagraph = document.createElement("p");
  descriptionParagraph.textContent = description;

  const bottomDiv = document.createElement("div");
  const priorityDiv = document.createElement("div");
  const prioritySpan = document.createElement("span");
  prioritySpan.textContent = priority[0].toUpperCase() + priority.slice(1);
  prioritySpan.className = `priority ${priority}`;
  priorityDiv.appendChild(prioritySpan);

  const editBtn = document.createElement("button");
  editBtn.addEventListener("click", () => {
    // taskTitleInput.value = taskTitle.textContent;
    // taskDescriptionInput.value = descriptionParagraph.textContent;
    // priorityInput.value = priority;
    // addNewProjectModal.showModal();
    // cancelProject.addEventListener(
    //   "click",
    //   () => {
    //     addNewProjectModal.close();
    //   },
    //   { once: true }
    // );
    // confirmProject.addEventListener(
    //   "click",
    //   () => {
    //     addNewProjectModal.close();
    //   },
    //   { once: true }
    // );
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

const addNewTaskBtn = document.getElementById("add-new-task");
addNewTaskBtn.addEventListener("click", () => {
  taskTitleInput.value = "";
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
        format(Date(dueDateInput.value), "Pp"),
        priorityInput.value
      );
      addNewTaskModal.close();
    },
    { once: true }
  );
});
