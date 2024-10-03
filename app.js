document.addEventListener("DOMContentLoaded", ()=> {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if(storedTasks){
        storedTasks.forEach((task)=> tasks.push(task));
        updateTasksList();
        updateStats();
    }
});

let tasks = [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text.length > 50) {
        alert('Task is too long! Maximum 50 characters allowed.');
        return;
    }

    if (text) {
        const date = new Date();
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`; 
        tasks.push({ text: text, completed: false, date: formattedDate });
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
    }
};


const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1); 
    updateTasksList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput'); 
    taskInput.value = tasks[index].text;

    tasks.splice(index, 1);
    updateTasksList(); 
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    const progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress}%`;

    document.getElementById("numbers").innerText = `${completedTasks} / ${totalTasks}`;

    if(tasks.length && completedTasks === totalTasks){
        blaskconfetti();
    }
};

const updateTasksList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; 
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');

        listItem.innerHTML = ` 
<div class="taskItem">
    <div class="task ${task.completed ? 'completed':''}">
        <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}/>
        <p>${task.date}</p> 
        <p>${task.text}</p>
    </div> 
    <div class="icons">
        <img src="./img/edit.png" onclick="editTask(${index})"/>
        <img src="./img/bin.png" onclick="deleteTask(${index})"/>
    </div>
</div>`;

        listItem.querySelector('.checkbox').addEventListener('change', () => toggleTaskComplete(index));
        taskList.append(listItem);
    });
};

document.getElementById('newTask').addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});

const blaskconfetti = () => {
    const duration = 15 * 500,
    animationEnd = Date.now() + duration;
  
  let skew = 1;
  
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  (function frame() {
    const timeLeft = animationEnd - Date.now(),
      ticks = Math.max(200, 500 * (timeLeft / duration));
  
    skew = Math.max(0.8, skew - 0.001);
  
    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        y: Math.random() * skew - 0.2,
      },
      colors: ["#ffffff"],
      shapes: ["circle"],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    });
  
    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  })();
};
