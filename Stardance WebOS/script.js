// 1. Live Clock Script
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  const timeString = hours + ':' + minutes + ' ' + ampm;
  const clockEl = document.getElementById('os-clock');
  if (clockEl) clockEl.textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

// 2. Open & Close Window Handlers
function closeWindow(windowId) {
  const targetWindow = document.getElementById(windowId);
  if (targetWindow) {
    targetWindow.style.display = 'none';
  }
}

function openWindow(windowId) {
  const targetWindow = document.getElementById(windowId);
  if (targetWindow) {
    targetWindow.style.display = 'block';
  }
}

// 3. Window Dragging Function
function makeDraggable(windowElement, headerElement) {
  if (!windowElement || !headerElement) return;

  let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

  headerElement.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    
    if (windowElement.style.transform !== 'none') {
      const rect = windowElement.getBoundingClientRect();
      windowElement.style.transform = 'none';
      windowElement.style.top = rect.top + 'px';
      windowElement.style.left = rect.left + 'px';
    }

    mouseX = e.clientX;
    mouseY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    posX = mouseX - e.clientX;
    posY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    windowElement.style.top = (windowElement.offsetTop - posY) + "px";
    windowElement.style.left = (windowElement.offsetLeft - posX) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Bind dragging logic safely on DOM load
document.addEventListener('DOMContentLoaded', () => {
  makeDraggable(document.getElementById("welcome-window"), document.getElementById("welcome-header"));
  makeDraggable(document.getElementById("notes-window"), document.getElementById("notes-header"));
  makeDraggable(document.getElementById("todo-window"), document.getElementById("todo-header"));
  makeDraggable(document.getElementById("timer-window"), document.getElementById("timer-header"));
  makeDraggable(document.getElementById("favs-window"), document.getElementById("favs-header"));
  makeDraggable(document.getElementById("fortune-window"), document.getElementById("fortune-header"));
  makeDraggable(document.getElementById("jams-window"), document.getElementById("jams-header"));
  makeDraggable(document.getElementById("facts-window"), document.getElementById("facts-header"));
  makeDraggable(document.getElementById("mood-window"), document.getElementById("mood-header"));

  //Cute Desktop Stickers (use emojis)
  makeDraggable(document.getElementById("sticker-1"), document.getElementById("sticker-1"));
  makeDraggable(document.getElementById("sticker-2"), document.getElementById("sticker-2"));
});


// 4. Interactive To-Do List Mechanics
function addTodoItem() {
  const input = document.getElementById('todo-input');
  if (!input) return;
  const taskText = input.value.trim();

  if (taskText === "") return;

  const todoList = document.getElementById('todo-list');

  const itemDiv = document.createElement('div');
  itemDiv.className = 'todo-item';

  itemDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <input type="checkbox" class="todo-checkbox" onchange="toggleTaskComplete(this)" />
      <span class="todo-text">${taskText}</span>
    </div>
    <button class="delete-btn" onclick="deleteTask(this)">✖</button>
  `;

  todoList.appendChild(itemDiv);
  input.value = "";
}

function toggleTaskComplete(checkbox) {
  const todoItem = checkbox.closest('.todo-item');
  if (checkbox.checked) {
    todoItem.classList.add('completed');
  } else {
    todoItem.classList.remove('completed');
  }
}

function deleteTask(button) {
  const todoItem = button.closest('.todo-item');
  todoItem.style.opacity = '0';
  todoItem.style.transform = 'scale(0.9)';
  setTimeout(() => {
    todoItem.remove();
  }, 200);
}

// 5. Focus Timer Mechanics
let timerInterval = null;
let totalTimeInSeconds = 25 * 60;
let initialTimeInSeconds = 25 * 60;
let isTimerRunning = false;

function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (!display) return;

  const minutes = Math.floor(totalTimeInSeconds / 60);
  const seconds = totalTimeInSeconds % 60;

  const formattedMin = minutes < 10 ? '0' + minutes : minutes;
  const formattedSec = seconds < 10 ? '0' + seconds : seconds;

  display.textContent = `${formattedMin}:${formattedSec}`;
}

function toggleTimer() {
  const btn = document.getElementById('timer-toggle-btn');

  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    btn.textContent = "Start";
  } else {
    if (totalTimeInSeconds <= 0) return;
    
    isTimerRunning = true;
    btn.textContent = "Pause";

    timerInterval = setInterval(() => {
      totalTimeInSeconds--;
      updateTimerDisplay();

      if (totalTimeInSeconds <= 0) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        btn.textContent = "Start";
        alert("Time's up! Great focus session ♡ 🎀");
      }
    }, 1000);
  }
}

function setCustomTimer() {
  const minInput = document.getElementById('timer-min');
  const secInput = document.getElementById('timer-sec');

  let mins = parseInt(minInput.value) || 0;
  let secs = parseInt(secInput.value) || 0;

  mins = Math.max(0, Math.min(99, mins));
  secs = Math.max(0, Math.min(59, secs));

  clearInterval(timerInterval);
  isTimerRunning = false;
  document.getElementById('timer-toggle-btn').textContent = "Start";

  totalTimeInSeconds = (mins * 60) + secs;
  initialTimeInSeconds = totalTimeInSeconds;
  updateTimerDisplay();
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  const btn = document.getElementById('timer-toggle-btn');
  if (btn) btn.textContent = "Start";

  totalTimeInSeconds = initialTimeInSeconds;
  updateTimerDisplay();
}

// 6. Lightbox Image Expansion Mechanics
function openLightbox(imgSrc, titleText, descText) {
  const modal = document.getElementById('image-lightbox');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');

  modalImg.src = imgSrc;
  modalTitle.textContent = titleText;
  modalDesc.textContent = descText;

  modal.style.display = 'flex';
}

function closeLightbox() {
  const modal = document.getElementById('image-lightbox');
  modal.style.display = 'none';
}

//Fortune Teller
const fortunes = [
    "Your smile has the power to brighten up anyone's darkest day! 💖",
    "Your creativity and unique ay of looking at things is truly inspiring! 💖",
    "You are a wonderful listener, and an incredibly loyal friend! 💖",
    "You are about to accomplish a goal that you have been working towards! ✨",
    "Your future is looking incredibly bright, full of laughter and joy! ✨",
    "The kindness you give to others will return very soon! ✨",
    "Treat yourself to your favorite food today, you deserve it! ✨",
    "Your positive energy is highly contagious, so keep spreading the joy! 🧸",
    "You are sweeter than a giant cup of hot cocoa with extra marshmallows! 🧸",
    "The universe is giving you a giant, warm, invisible hug at this exact moment! 🧸", 
    "Good luck and may happy thoughts follow you everywhere you go today! 🧸",
    "Be proud of who you are, because you are truly someone special! 🌸",
    "You are deeply appreciated by the people who hold you close to their hearts! 🌸",
    "You are entirely unique, and that is your aboslute greatest superpower! 🌸",
    "The world is geniunely a better place simply because you are in it! 🌸",
    "You are doing a wonderful job, even if it doesn't always feel like it! 🌸"
]; 

function generateFortune() {
    const fortuneText = document.getElementById('fortune-text');
    const random = Math.floor(Math.random() * fortunes.length);
    fortuneText.textContent = fortunes[random];
}

//Animal Factts Generator
const animalFacts = [
    "Jellyfish have been floating aroung on Earth for over 500 million years, long before dinosaurs existed! 🪼",
    "Sea otters hold hands while they sleep so they don't drift away from each other in the current! 🦦",
    "Dolphins have names for each other! They develop a unique whistle signature to call out to specific friends! 🐬",
    "Octopuses have three hearts and blue blood!🐙",
    "Red pandas use their long, bushy tails as cozy blankets to keep warm in the winter! ❄️",
    "Blue whales' hearts are the size of a small car, and their tongue can weight as much as an entire adult elephant! 🐋",
    "There is an immortal jellyfish that can basically restart its life cycle when it gets damaged or aged! 🪼 ",
    "Sea otters have a built-in pocket of loose skin under their forearms where they store their favorite rock! 🦦",
    "Honeybees communicate the exact location of flowers to their hive by performing a special 'waggle dance' that maps out distance and direction! 🐝",
    "Squirrels accidentally plant millions of trees every year because they bury nuts and acorns all over the forest floor and simply forget where they hid them! 🐿️",
    "Snow leopards use their long, extra-fluffy tails as cozy mufflers to wrap around their faces to stay warm while sleeping in freezing blizzards! 🐆"

];

function generateAnimalFact() {
    const randomIndex = Math.floor(Math.random() *  animalFacts.length);
    document.getElementById("fact-display-box").innerText = animalFacts[randomIndex];
}

//Daily Mood Encouragemnt
function setMood(moodType) {
    const responseBox = document.getElementById("mood-response-box");

    if(moodType==='happy') {
        responseBox.innerText = "🌸 Yay! Your joy is so radiant today. Keep glowing and spreading that wonderful energy!";
    } else if (moodType==='tired') {
        responseBox.innerText = "☁️ Take a deep breath and give yourself permission to rest. You've worked hard, so drink some water and cozy up!";
    } else if (moodType === 'sad') {
        responseBox.innerText = "🌧️ I'm sending you the biggest hug. Even rainy days eventually clear up, and you are so strong, loved, and valued ♡";
    } else if (moodType==='motivated') {
        responseBox.innerText = "👑 Absolute main character energy today! You are capable of achieving anything you set your mind to. Go get 'em!";
    }
}

