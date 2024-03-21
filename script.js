// Hamburger Menu Toggle
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburgerMenu.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburgerMenu.setAttribute('aria-expanded', navLinks.classList.contains('active'));
});

// Slideshow
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(n) {
  slides.forEach(slide => slide.classList.remove('active'));
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

setInterval(nextSlide, 5000); // Change slide every 5 seconds

// Form Validation
const form = document.getElementById('contact-form');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const commentsInput = document.getElementById('message');
const termsCheckbox = document.getElementById('termsConditions');

form.addEventListener('submit', (e) => {
  // Prevent the form from submitting by default
  e.preventDefault();

  // Validate the form fields
  let isValid = true;

  if (firstNameInput.value.trim() === '') {
    isValid = false;
    alert('Please enter your First Name.');
    firstNameInput.focus();
    return; // Stop further validation
  }

  if (lastNameInput.value.trim() === '') {
    isValid = false;
    alert('Please enter your Last Name.');
    lastNameInput.focus();
    return; // Stop further validation
  }

  if (emailInput.value.trim() === '') {
    isValid = false;
    alert('Please enter your Email.');
    emailInput.focus();
    return; // Stop further validation
  } else if (!isValidEmail(emailInput.value.trim())) {
    isValid = false;
    alert('Please enter a valid Email.');
    emailInput.focus();
    return; // Stop further validation
  }

  if (commentsInput.value.trim() === '') {
    isValid = false;
    alert('Please enter your Comments.');
    commentsInput.focus();
    return; // Stop further validation
  }

  if (!termsCheckbox.checked) {
    isValid = false;
    alert('Please agree to the Terms & Conditions.');
    return; // Stop further validation
  }

  // If all fields are valid and the checkbox is checked, submit the form
  if (isValid) {
    form.submit();
  }
});

// Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Remove static movie items
const removeButtons = document.querySelectorAll('.remove-button');

removeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const movieItem = button.parentElement;
    movieItem.remove();
  });
});

// API Integration
const baseUrl = 'https://api.tvmaze.com';
const moviesContainer = document.querySelector('.movies');
const searchInput = document.querySelector('.search-movies input');

async function searchShows(query) {
  try {
    const response = await fetch(`${baseUrl}/search/shows?q=${query}`);
    const data = await response.json();
    return data.map(item => item.show);
  } catch (error) {
    console.error('Error fetching shows:', error);
    return [];
  }
}

function displayShows(shows) {
  moviesContainer.innerHTML = ''; // Clear the container

  if (shows.length === 0) {
    moviesContainer.innerHTML = '<p>No shows found.</p>';
    return;
  }

  shows.forEach(show => {
    const showItem = document.createElement('div');
    showItem.classList.add('movie-item');

    const img = document.createElement('img');
    img.src = show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image';
    img.alt = show.name;
    img.setAttribute('aria-label', `${show.name} poster`);

    const title = document.createElement('h3');
    title.textContent = show.name;

    const description = document.createElement('p');
    description.textContent = show.summary?.replace(/<\/?[^>]+(>|$)/g, ''); // Remove HTML tags

    const addButton = document.createElement('button');
    addButton.textContent = '+ Add to Grid';
    addButton.addEventListener('click', () => addToGrid(show));

    showItem.appendChild(img);
    showItem.appendChild(title);
    showItem.appendChild(description);
    showItem.appendChild(addButton);

    moviesContainer.appendChild(showItem);
  });
}

function addToGrid(show) {
  const addedShowsContainer = document.querySelector('.added-shows');

  const showItem = document.createElement('div');
  showItem.classList.add('added-show-item');

  const img = document.createElement('img');
  img.src = show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image';
  img.alt = show.name;
  img.setAttribute('aria-label', `${show.name} poster`);

  const title = document.createElement('h3');
  title.textContent = show.name;

  const description = document.createElement('p');
  description.textContent = show.summary?.replace(/<\/?[^>]+(>|$)/g, ''); // Remove HTML tags

  const removeButton = document.createElement('button');
  removeButton.textContent = 'X';
  removeButton.setAttribute('aria-label', `Remove ${show.name} from grid`);
  removeButton.addEventListener('click', () => removeFromGrid(showItem));

  showItem.appendChild(img);
  showItem.appendChild(title);
  showItem.appendChild(description);
  showItem.appendChild(removeButton);

  addedShowsContainer.appendChild(showItem);
}

function removeFromGrid(showItem) {
  showItem.remove();
}

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  if (query) {
    const shows = await searchShows(query);
    displayShows(shows);
  } else {
    displayShows([]);
  }
});