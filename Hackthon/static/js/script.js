// DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const messagesContainer = document.getElementById('messages');
const chatArea = document.getElementById('chatArea');
const projectIdeasBtn = document.getElementById('projectIdeasBtn');
const teamMatchingBtn = document.getElementById('teamMatchingBtn');
const newChatBtn = document.getElementById('newChatBtn');
const chatHeader = document.getElementById('chatHeader');
const projectIdeasPanel = document.getElementById('projectIdeasPanel');
const teamMatchingPanel = document.getElementById('teamMatchingPanel');
const skillsSelection = document.getElementById('skillsSelection');
const findTeamBtn = document.getElementById('findTeamBtn');
const teamMatchResult = document.getElementById('teamMatchResult');
const projectIdeasList = document.getElementById('projectIdeasList');

// App state
let currentView = 'chat';
let selectedSkills = [];

// Event listeners
document.addEventListener('DOMContentLoaded', init);
chatForm.addEventListener('submit', handleChatSubmit);
projectIdeasBtn.addEventListener('click', showProjectIdeas);
teamMatchingBtn.addEventListener('click', showTeamMatching);
newChatBtn.addEventListener('click', showChat);
findTeamBtn.addEventListener('click', findTeamMembers);

// Initialize suggested questions
document.querySelectorAll('.btn-suggested').forEach(button => {
    button.addEventListener('click', () => {
        const question = button.getAttribute('data-question');
        userInput.value = question;
        handleChatSubmit(new Event('submit'));
    });
});

// Initialize app
function init() {
    // Load skills for team matching
    fetchSkills();
    
    // Load project ideas
    fetchProjectIdeas();
}

// Fetch available skills
function fetchSkills() {
    fetch('/api/skills')
        .then(response => response.json())
        .then(skills => {
            displaySkills(skills);
        })
        .catch(error => {
            console.error('Error fetching skills:', error);
            skillsSelection.innerHTML = '<p class="text-danger">Failed to load skills. Please try again later.</p>';
        });
}

// Display skills as checkboxes
function displaySkills(skills) {
    const skillsHTML = document.createElement('div');
    skillsHTML.className = 'skills-grid';
    
    skills.forEach((skill, index) => {
        const id = `skill-${index}`;
        const skillItem = document.createElement('div');
        
        skillItem.innerHTML = `
            <input type="checkbox" id="${id}" class="skill-checkbox" value="${skill}">
            <label for="${id}" class="skill-label">${skill}</label>
        `;
        
        skillsHTML.appendChild(skillItem);
    });
    
    skillsSelection.innerHTML = '';
    skillsSelection.appendChild(skillsHTML);
    
    // Add event listeners to skill checkboxes
    document.querySelectorAll('.skill-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedSkills.push(e.target.value);
            } else {
                selectedSkills = selectedSkills.filter(skill => skill !== e.target.value);
            }
        });
    });
}

// Fetch project ideas
function fetchProjectIdeas() {
    fetch('/api/project-ideas')
        .then(response => response.json())
        .then(projects => {
            displayProjectIdeas(projects);
        })
        .catch(error => {
            console.error('Error fetching project ideas:', error);
            projectIdeasList.innerHTML = '<p class="text-danger">Failed to load project ideas. Please try again later.</p>';
        });
}

// Display project ideas
function displayProjectIdeas(projects) {
    projectIdeasList.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        const skillsHTML = project.skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
        
        projectCard.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div class="skills">
                ${skillsHTML}
            </div>
        `;
        
        projectIdeasList.appendChild(projectCard);
    });
}

// Handle chat form submission
function handleChatSubmit(event) {
    event.preventDefault();
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Display user message
    addMessage(message, 'user');
    
    // Clear input
    userInput.value = '';
    
    // Send to backend and get response
    sendMessageToBackend(message);
}

// Add message to chat
function addMessage(text, sender = 'bot', timestamp = 'Just now') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
            <div class="message-time">${timestamp}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Auto scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Hide suggested questions after user sends a message
    const suggestedQuestions = document.querySelector('.suggested-questions');
    if (suggestedQuestions && sender === 'user') {
        suggestedQuestions.style.display = 'none';
    }
}

// Send message to backend
function sendMessageToBackend(message) {
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message typing-indicator';
    typingIndicator.innerHTML = '<div class="message-content"><p>Typing...</p></div>';
    messagesContainer.appendChild(typingIndicator);
    
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
        // Remove typing indicator
        messagesContainer.removeChild(typingIndicator);
        
        // Add bot response
        addMessage(data.response, 'bot', formatTimestamp(data.timestamp));
    })
    .catch(error => {
        console.error('Error sending message:', error);
        
        // Remove typing indicator
        messagesContainer.removeChild(typingIndicator);
        
        // Show error message
        addMessage('Sorry, there was an error processing your request. Please try again.', 'bot');
    });
}

// Format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Just now';
    
    // Convert to relative time if needed
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    // Otherwise return formatted time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// View switching functions
function showProjectIdeas() {
    if (currentView === 'projectIdeas') return;
    
    hideAllPanels();
    projectIdeasPanel.style.display = 'block';
    currentView = 'projectIdeas';
    
    updateActiveButton(projectIdeasBtn);
}

function showTeamMatching() {
    if (currentView === 'teamMatching') return;
    
    hideAllPanels();
    teamMatchingPanel.style.display = 'block';
    currentView = 'teamMatching';
    
    updateActiveButton(teamMatchingBtn);
}

function showChat() {
    if (currentView === 'chat') return;
    
    hideAllPanels();
    chatArea.style.display = 'flex';
    currentView = 'chat';
    
    updateActiveButton(newChatBtn);
}

function hideAllPanels() {
    chatArea.style.display = 'none';
    projectIdeasPanel.style.display = 'none';
    teamMatchingPanel.style.display = 'none';
}

function updateActiveButton(activeButton) {
    document.querySelectorAll('.btn-sidebar').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Find team members
function findTeamMembers() {
    if (selectedSkills.length === 0) {
        teamMatchResult.style.display = 'block';
        teamMatchResult.innerHTML = '<p class="text-warning">Please select at least one skill.</p>';
        return;
    }
    
    teamMatchResult.innerHTML = '<p>Finding team members...</p>';
    teamMatchResult.style.display = 'block';
    
    fetch('/api/team-matching', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skills: selectedSkills })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const skillsHTML = data.recommended_skills.map(skill => 
                `<span class="skill-tag">${skill}</span>`
            ).join('');
            
            teamMatchResult.innerHTML = `
                <p>${data.message}:</p>
                <div class="recommended-skills">
                    ${skillsHTML}
                </div>
                <p class="mt-3">Reach out to participants with these skills via the hackathon's team formation channel!</p>
            `;
        } else {
            teamMatchResult.innerHTML = `<p class="text-warning">${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error matching team:', error);
        teamMatchResult.innerHTML = '<p class="text-danger">Failed to find team members. Please try again later.</p>';
    });
} 