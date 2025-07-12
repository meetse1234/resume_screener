class RecruitmentManager {
    constructor() {
        this.form = document.getElementById('recruitmentForm');
        this.candidatesList = document.getElementById('candidatesList');
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Listen for shortlisted candidates from the resume analysis
        document.addEventListener('candidatesShortlisted', (event) => {
            this.updateShortlistedCandidates(event.detail.candidates);
        });
    }

    updateShortlistedCandidates(candidates) {
        this.candidatesList.innerHTML = candidates.map(candidate => `
            <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div>
                    <h4 class="font-semibold">${candidate.name}</h4>
                    <p class="text-sm text-gray-600">${candidate.position}</p>
                    <p class="text-sm text-gray-500">${candidate.email}</p>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-green-500 font-semibold">${candidate.matchScore}%</span>
                    <button 
                        onclick="recruitmentManager.selectCandidate('${candidate.email}', '${candidate.name}', '${candidate.position}')"
                        class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                        Select
                    </button>
                </div>
            </div>
        `).join('');
    }

    selectCandidate(email, name, position) {
        document.getElementById('recipientEmail').value = email;
        let template = document.getElementById('emailBody').value;
        template = template.replace('[Candidate Name]', name);
        template = template.replace('[Position]', position);
        document.getElementById('emailSubject').value = `Interview Invitation - ${position}`;
    }

    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.sendEmail();
        });
    }

    async sendEmail() {
        const emailData = {
            recipient: document.getElementById('recipientEmail').value,
            subject: document.getElementById('emailSubject').value,
            body: document.getElementById('emailBody').value,
            interviewDateTime: document.getElementById('interviewDateTime').value
        };

        try {
            const response = await fetch('/api/send-recruitment-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) throw new Error('Failed to send email');

            alert('Interview invitation sent successfully!');
            this.form.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send email. Please try again.');
        }
    }
}

const recruitmentManager = new RecruitmentManager();


function selectRecipient(email, name) {
    // Update recipient email
    document.getElementById('recipientEmail').value = email;
    
    // Update email body with candidate name
    const emailBody = document.getElementById('emailBody');
    const template = emailBody.value;
    const updatedBody = template.replace('[Candidate Name]', name);
    emailBody.value = updatedBody;
    
    // Highlight selected candidate
    const candidates = document.querySelectorAll('.candidate-item');
    candidates.forEach(candidate => {
        candidate.classList.remove('bg-blue-50');
    });
    
    const selectedCandidate = document.querySelector(`[data-email="${email}"]`);
    if (selectedCandidate) {
        selectedCandidate.classList.add('bg-blue-50');
    }
}

// Function to add new candidate to the list
function addCandidate(name, email) {
    const candidatesList = document.getElementById('candidatesList');
    const candidateItem = document.createElement('div');
    candidateItem.className = 'candidate-item p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50';
    candidateItem.setAttribute('onclick', `selectRecipient('${email}', '${name}')`);
    candidateItem.setAttribute('data-email', email);
    candidateItem.setAttribute('data-name', name);
    
    candidateItem.innerHTML = `
        <h4 class="font-semibold">${name}</h4>
        <p class="text-sm text-gray-600">${email}</p>
    `;
    
    candidatesList.appendChild(candidateItem);
}

// Add this to your existing event listeners
document.addEventListener('DOMContentLoaded', () => {
    const candidatesList = document.getElementById('candidatesList');
    if (candidatesList) {
        candidatesList.addEventListener('click', (e) => {
            const candidateItem = e.target.closest('.candidate-item');
            if (candidateItem) {
                const email = candidateItem.querySelector('[data-email]').dataset.email;
                const name = candidateItem.querySelector('[data-name]').dataset.name;
                selectRecipient(email, name);
            }
        });
    }
});