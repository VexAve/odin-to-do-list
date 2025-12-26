class Task {
  constructor(title, description, dueDate, priority) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.done = false;
  }

  edit(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  markAsDone() {
    this.done = true;
  }

  unmarkAsDone() {
    this.done = false;
  }
}

class Project {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.tasksList = [];
  }

  edit(title) {
    this.title = title;
  }

  findTask(id) {
    return this.tasksList.find((task) => task.id === id);
  }

  addTask(task) {
    this.tasksList.push(task);
  }

  deleteTask(id) {
    this.tasksList = this.tasksList.filter((task) => task.id !== id);
  }
}

class ProjectsList {
  constructor() {
    this.projectsList = [];
  }

  findProject(id) {
    return this.projectsList.find((project) => project.id === id);
  }

  addProject(project) {
    this.projectsList.push(project);
  }

  deleteProject(id) {
    this.projectsList = this.projectsList.filter(
      (project) => project.id !== id
    );
  }
}

export { Task, Project, ProjectsList };
