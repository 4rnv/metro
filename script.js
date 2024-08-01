window.onload = function () {
    displayClock();
    displayDate();
    quoteLiveTile();
}
function displayClock(){
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  if(hours < 10) {
    hours = '0' + hours;
  }
  if(minutes < 10) {
    minutes = '0' + minutes;
  }
  var display = hours + ':' + minutes;
  var clock = document.getElementById('clock');
  clock.textContent = display;
  
  setTimeout(displayClock, 1000); 
}

function displayDate() {
    var now = new Date();
    var date = now.getDate();
    var calendar = document.getElementById('calendar');
    calendar.textContent = date;
}

function toggleAllApps() {
  const allApps = document.getElementById('app-center');
  const startScreen = document.getElementById('start-screen');
  startScreen.classList.toggle('hidden');
  allApps.classList.toggle('open');
}

let touchstartX = 0;
let touchendX = 0;

const startScreen = document.getElementById('start-screen');
const allApps = document.getElementById('app-center');

startScreen.addEventListener('touchstart', (e) => {
  touchstartX = e.changedTouches[0].screenX;
});

startScreen.addEventListener('touchend', (e) => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture(0);
});

allApps.addEventListener('touchstart', (e) => {
  touchstartX = e.changedTouches[0].screenX;
});

allApps.addEventListener('touchend', (e) => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture(1);
});

function handleGesture(pointer) {
  if (pointer===1) {
    if (touchendX > touchstartX) {
      toggleAllApps();
  }
  }
  else if (pointer===0) {
  if (touchendX < touchstartX) {
      toggleAllApps();
  }
  }
}

async function quoteLiveTile() {
  try {
    const response = await fetch('https://yurippe.vercel.app/api/quotes?show=violet%20evergarden&random=1');
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }
    const quote = await response.json();
    // console.log(quote);
    let liveTile = document.getElementById('live-tile');
    liveTile.textContent = quote[0].quote;
  } catch (error) {
    console.error(error.message);
  }
}

function flipTile() {
  const tile = document.getElementById('quote-tile');
  tile.classList.toggle('flipped');
  setTimeout(() => {
    quoteLiveTile();
  }, 1000);
}

// Function to apply the tile color
function applyTileColor(tileColor) {
  const defaultTileColor = '#1BA1E2';

  // Validate the tile color
  if (tileColor === '#000000') {
    alert("Can't use pure black as accent colour");
    return false; // Indicate failure
  } else {
    const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(tileColor) || /^rgba?\(\s*(\d{1,3}\s*,\s*){2,3}\d{1,3}\s*(,\s*(0(\.\d+)?|1(\.0+)?))?\s*\)$/i.test(tileColor);
    if (isValidColor) {
      document.documentElement.style.setProperty('--accent', tileColor);
      localStorage.setItem('Windows-Phone-Accent-Colour', tileColor);
      return true;
    } else {
      alert('Invalid color value. Please enter a valid hex (#rrggbb format) or rgba color(rr,gg,bb,aa format)');
      return false;
    }
  }
}

// Function to apply the background image
function applyBackgroundImage(backgroundImageUrl) {
  const defaultBackground = '#000000';

  if (backgroundImageUrl) {
    document.body.style.backgroundImage = `url(${backgroundImageUrl})`;
    localStorage.setItem('Windows-Phone-Background', backgroundImageUrl);
  } else {
    document.body.style.backgroundColor = defaultBackground;
  }
}

function applySettings() {
  const tileColorInput = document.getElementById('accent-picker').value;
  const backgroundImageUrlInput = document.getElementById('background-image-url').value;

  const tileColor = tileColorInput || '#1BA1E2';
  const isTileColorValid = applyTileColor(tileColor);
  
  if (isTileColorValid) {
    applyBackgroundImage(backgroundImageUrlInput);
  }
}

function loadSettings() {
  const savedTileColor = localStorage.getItem('Windows-Phone-Accent-Colour') || '#1BA1E2';
  const savedBackgroundImage = localStorage.getItem('Windows-Phone-Background') || '#000000';

  // Apply the saved tile color
  document.documentElement.style.setProperty('--accent', savedTileColor);
  //document.getElementById('accent-picker').value = savedTileColor;

  // Apply the saved background image or color
  if (savedBackgroundImage.startsWith('http')) {
    document.body.style.backgroundImage = `url(${savedBackgroundImage})`;
  } else {
    document.body.style.backgroundColor = savedBackgroundImage;
  }
}

document.getElementById('apply-settings-button').addEventListener('click', applySettings);

document.addEventListener('DOMContentLoaded', loadSettings);

document.getElementById('accent-picker').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    applySettings();
  }
});

document.getElementById('background-image-url').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    applySettings();
  }
});

function clearStorage() {
  localStorage.removeItem('Windows-Phone-Accent-Colour');
  localStorage.removeItem('Windows-Phone-Background');
  loadSettings();
}

setInterval(flipTile, 10000);