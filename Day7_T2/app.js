// Select elements
const fullscreenBtn = document.querySelector('.fullscreen');
const mainContent = document.querySelector('.main-content'); // Main content area
const header = document.querySelector('#mainHeader'); // Header element
const sidebar = document.querySelector('#menu-container'); // Sidebar container
const closeFullscreenBtn = document.querySelector('.close-fullscreen');
const responsiveSidebar = document.querySelector('#Responsive-menu-container');

// Toggle fullscreen mode
fullscreenBtn.addEventListener('click', function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// Handle fullscreen change
document.addEventListener('fullscreenchange', function () {
  if (document.fullscreenElement) {
    // Enter fullscreen
    mainContent.classList.add('w-full', 'h-screen', 'm-0', 'p-4');
    sidebar.classList.add('hidden');
    header.classList.add('hidden');
    responsiveSidebar.classList.add('hidden');
    closeFullscreenBtn.classList.remove('hidden');
  } else {
    // Exit fullscreen
    mainContent.classList.remove('w-full', 'h-screen', 'm-0', 'p-4');
    sidebar.classList.remove('hidden');
    header.classList.remove('hidden');
    responsiveSidebar.classList.remove('hidden');
    closeFullscreenBtn.classList.add('hidden');
  }
});

// Close fullscreen when clicking the close button
closeFullscreenBtn.addEventListener('click', function () {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
});

// Update time
function updateTime() {
  const timeElement = document.querySelector('.time');
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  timeElement.innerText = `${hours}:${minutes}`;
}

// Handle header background on scroll
document.addEventListener('scroll', () => {
  const element = document.getElementById('mainHeader');

  if (window.scrollY > 0) {
    // Remove transparent, add semi-transparent white
    element.classList.remove('bg-transparent');
    element.classList.add('bg-white', 'bg-opacity-75', 'rounded-2xl');
  } else {
    // Remove semi-transparent white, add transparent
    element.classList.remove('bg-white', 'bg-opacity-75', 'rounded-2xl');
    element.classList.add('bg-transparent');
  }
});

// Initial time update and set interval
setInterval(updateTime, 1000);
updateTime();
