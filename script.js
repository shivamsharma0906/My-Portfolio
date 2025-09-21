// Theme Toggle
const themeBtn = document.querySelector('.theme-toggle-btn');
const body = document.body;

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        themeBtn.innerHTML = body.classList.contains('light-theme')
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Mobile Menu
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.innerHTML = navLinks.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuBtn) menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Scroll Animations
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => observer.observe(element));

// Skill Bar Animation
const skillBars = document.querySelectorAll('.progress');
const animateSkills = () => {
    skillBars.forEach(bar => {
        const width = bar.style.getPropertyValue('--width');
        if (width) bar.style.width = width;
    });
};

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(skillsSection);
        }
    }, { threshold: 0.5 });

    skillsObserver.observe(skillsSection);
}

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach(card => {
                const tech = card.dataset.tech.split(' ');
                if (filter === 'all' || tech.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 0);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// Logo Modal
const logo = document.querySelector('.logo-img');
const modal = document.querySelector('#logoModal');

if (logo && modal) {
    logo.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Accessibility: Keyboard Navigation for Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
}

// Chatbot - Updated with smooth show/hide behavior
let greeted = false;
const chatToggle = document.getElementById('chat-toggle');
const chatbot = document.getElementById('chatbot');
const chatClose = document.querySelector('.chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.querySelector('.chat-messages');
const suggestions = document.querySelectorAll('.suggestion');

const chatResponses = {
    "about": "I'm Shivam Sharma, an AI/ML student passionate about deep learning, computer vision, and ethical AI. Check my projects for more!",
    "projects": "I've worked on Weather App, Attendance Tracker, and NeuraGo AI Chatbot. See the Projects section for details!",
    "skills": "I'm skilled in Python, TensorFlow, OpenCV, Firebase, LangChain, Flutter, and more. Check the Skills section!",
    "contact": "You can reach me via the Contact form or email: shivam17sharma2004@gmail.com",
    "hello": "Hello! What can I help you with today?",
    "hi": "Hi there! How can I assist you?",
    "help": "I can tell you about my projects, skills, experience, or contact information. What would you like to know?",
    "experience": "I'm currently pursuing CSE with AI/ML specialization and have worked on various projects in machine learning and web development.",
    "default": "I didn't understand that. Try asking about my projects, skills, or contact info!"
};

function openChatbot() {
    if (chatToggle && chatbot) {
        // Hide the toggle button with animation
        chatToggle.classList.add('hide');
        
        // Show chatbot after a brief delay
        setTimeout(() => {
            chatbot.classList.add('show');
            
            // Send greeting message if first time
            if (!greeted) {
                setTimeout(() => {
                    addMessage('bot', "Hello! Welcome to Shivam's Portfolio. How may I help you?");
                    greeted = true;
                }, 300);
            }
            
            // Focus on input
            if (chatInput) {
                setTimeout(() => chatInput.focus(), 400);
            }
        }, 150);
    }
}

function closeChatbot() {
    if (chatToggle && chatbot) {
        // Hide chatbot
        chatbot.classList.remove('show');
        
        // Show toggle button after chatbot is hidden
        setTimeout(() => {
            chatToggle.classList.remove('hide');
        }, 300);
    }
}

// Event listeners
if (chatToggle) {
    chatToggle.addEventListener('click', openChatbot);
}

if (chatClose) {
    chatClose.addEventListener('click', closeChatbot);
}

if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Handle suggestion clicks
suggestions.forEach(btn => {
    btn.addEventListener('click', () => {
        if (chatInput) {
            chatInput.value = btn.textContent.toLowerCase();
            sendMessage();
        }
    });
});

// Close chatbot when clicking outside
document.addEventListener('click', (e) => {
    if (chatbot && chatbot.classList.contains('show')) {
        if (!chatbot.contains(e.target) && !chatToggle.contains(e.target)) {
            closeChatbot();
        }
    }
});

// Close chatbot with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatbot && chatbot.classList.contains('show')) {
        closeChatbot();
    }
});

function sendMessage() {
    if (!chatInput) return;
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage('user', message);
    chatInput.value = '';

    // Find response
    const cleaned = message.toLowerCase();
    let response = chatResponses["default"];
    
    for (const [key, value] of Object.entries(chatResponses)) {
        if (cleaned.includes(key)) {
            response = value;
            break;
        }
    }

    // Add bot response with delay
    setTimeout(() => addMessage('bot', response), 600);
}

function addMessage(type, text) {
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = text;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Contact Form - Fixed version
const contactForm = document.getElementById("form");
const successPopup = document.getElementById("success-popup");

if (contactForm && successPopup) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitBtn = document.getElementById("submit-btn");
        const btnText = submitBtn.querySelector(".btn-text");
        const btnSpinner = submitBtn.querySelector(".btn-spinner");
        const formStatus = document.getElementById("form-status");

        // Show loading state
        if (btnText) btnText.style.display = "none";
        if (btnSpinner) btnSpinner.style.display = "inline-block";
        submitBtn.disabled = true;

        fetch("https://formspree.io/f/xgvyrjqn", {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData,
        })
        .then((response) => {
            if (response.ok) {
                // Success
                contactForm.reset();
                contactForm.classList.add("form-success");
                successPopup.classList.add("show");
                
                if (formStatus) {
                    formStatus.textContent = "Message sent successfully!";
                    formStatus.className = "success";
                    formStatus.style.display = "block";
                }

                setTimeout(() => {
                    successPopup.classList.remove("show");
                    contactForm.classList.remove("form-success");
                    if (formStatus) formStatus.style.display = "none";
                }, 3000);
            } else {
                throw new Error("Form submission failed");
            }
        })
        .catch((error) => {
            // Error
            contactForm.classList.add("form-error");
            
            if (formStatus) {
                formStatus.textContent = "Something went wrong. Please try again.";
                formStatus.className = "error";
                formStatus.style.display = "block";
            }

            setTimeout(() => {
                contactForm.classList.remove("form-error");
                if (formStatus) formStatus.style.display = "none";
            }, 3000);
        })
        .finally(() => {
            // Reset button state
            if (btnText) btnText.style.display = "inline";
            if (btnSpinner) btnSpinner.style.display = "none";
            submitBtn.disabled = false;
        });
    });
}

// Lazy Load Images
const lazyImages = document.querySelectorAll('img[data-src]');
if (lazyImages.length > 0) {
    const lazyLoad = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    lazyImages.forEach(img => lazyLoad.observe(img));
}