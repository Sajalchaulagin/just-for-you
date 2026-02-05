// DOM elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const buttonsContainer = document.querySelector('.buttons-container');
const successMessage = document.getElementById('success-message');
const themeButtons = document.querySelectorAll('.theme-btn');
const countdownDays = document.getElementById('days');
const countdownHours = document.getElementById('hours');
const countdownMinutes = document.getElementById('minutes');
const countdownSeconds = document.getElementById('seconds');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const musicText = musicToggle.querySelector('span');

// Variables to track button growth
let yesBtnScale = 1;
let noBtnClickCount = 0;
const maxClicks = 5; // Number of clicks before No button disappears

//set small volume
bgMusic.volume = 0.2;

// allow autoplay after first user interaction
function startMusicOnce(){
    bgMusic.play().catch(() => {});
    document.removeEventListener('click', startMusicOnce);
    document.removeEventListener('touchstart', startMusicOnce);
}

// listen for first interaction
document.addEventListener('click', startMusicOnce);
document.addEventListener('touchstart', startMusicOnce);


// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Start the countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Set initial active theme
    setActiveTheme('romantic-pink');
    
    // Initialize music button state
    updateMusicButton();
    
    // Add click event to the Yes button
    yesBtn.addEventListener('click', function() {
        // Show success message with animation
        successMessage.style.display = 'block';
        successMessage.style.animation = 'fadeIn 1s ease';
        
        // Hide the buttons container
        buttonsContainer.style.display = 'none';
        
        // Play a happy sound (optional)
        playHappySound();
        
        // Add pulsing animation to success message
        successMessage.style.animation = 'pulse 2s infinite';
    });
    
    // Add click event to the No button
    noBtn.addEventListener('click', function() {
        noBtnClickCount++;
        
        // Increase the size of Yes button
        yesBtnScale += 0.3;
        yesBtn.style.transform = `scale(${yesBtnScale})`;
        
        // Make No button smaller and fade out gradually
        const noBtnOpacity = 1 - (noBtnClickCount / maxClicks);
        noBtn.style.opacity = noBtnOpacity;
        noBtn.style.transform = `scale(${1 - (noBtnClickCount / maxClicks) * 0.5})`;
        
        // If max clicks reached, hide No button completely
        if (noBtnClickCount >= maxClicks) {
            noBtn.style.display = 'none';
            
            // Move Yes button to center
            buttonsContainer.style.justifyContent = 'center';
            
            // Show a playful message
            setTimeout(() => {
                alert("Haha, I knew you'd say yes! ❤️");
            }, 300);
        } else {
            // Move the No button randomly to make it harder to click
            const maxMove = 50;
            const randomX = Math.random() * maxMove * 2 - maxMove;
            const randomY = Math.random() * maxMove * 2 - maxMove;
            noBtn.style.transform += ` translate(${randomX}px, ${randomY}px)`;
        }
    });
    
    // Add event listeners to theme buttons
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setActiveTheme(theme);
            
            // Update active button styling
            themeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add event listener to music toggle button
    musicToggle.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
        updateMusicButton();
    });
    
    // Preload audio to avoid delay on first play
    bgMusic.load();
});

// Function to update the countdown to Valentine's Day
function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Set Valentine's Day to February 14 of the current year
    // If it's already past February 14 this year, target next year
    let valentinesDay = new Date(currentYear, 1, 14); // February is month 1 (0-indexed)
    
    if (now > valentinesDay) {
        valentinesDay = new Date(currentYear + 1, 1, 14);
    }
    
    // Calculate time difference
    const timeDiff = valentinesDay.getTime() - now.getTime();
    
    // Calculate days, hours, minutes, seconds
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Update countdown display
    countdownDays.textContent = days.toString().padStart(2, '0');
    countdownHours.textContent = hours.toString().padStart(2, '0');
    countdownMinutes.textContent = minutes.toString().padStart(2, '0');
    countdownSeconds.textContent = seconds.toString().padStart(2, '0');
}

// Function to set the active theme
function setActiveTheme(theme) {
    // Remove all theme classes from body
    document.body.classList.remove(
        'romantic-pink', 
        'starry-night', 
        'sunset-love', 
        'lavender-dream',
        'hearts-bg',
        'roses-bg'
    );
    
    // Add the selected theme class
    document.body.classList.add(theme);
    
    // Store the theme in localStorage to remember preference
    localStorage.setItem('valentineTheme', theme);
}

// Function to update music button text and icon
function updateMusicButton() {
    if (bgMusic.paused) {
        musicText.textContent = 'Play Music';
        musicToggle.innerHTML = '<i class="fas fa-music"></i> <span>Play Music</span>';
    } else {
        musicText.textContent = 'Pause Music';
        musicToggle.innerHTML = '<i class="fas fa-pause"></i> <span>Pause Music</span>';
    }
}

// Function to play a happy sound when Yes is clicked
function playHappySound() {
    // Create a temporary audio element for the success sound
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-happy-crowd-laugh-464.mp3');
    audio.volume = 0.3;
    
    // Play the sound
    audio.play().catch(e => {
        console.log("Audio play failed:", e);
        // If audio fails, just continue silently
    });
}

// Load saved theme preference if available
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('valentineTheme');
    if (savedTheme) {
        setActiveTheme(savedTheme);
        
        // Update active button
        themeButtons.forEach(button => {
            if (button.getAttribute('data-theme') === savedTheme) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
}

// Call loadSavedTheme when page loads
window.addEventListener('load', loadSavedTheme);