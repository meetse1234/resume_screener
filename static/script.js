document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let uploadedFiles = [];
    let globalResults = [];

    // Get DOM elements
    const dropArea = document.getElementById('dropArea');
    const fileList = document.getElementById('fileList');
    const resumeFiles = document.getElementById('resumeFiles');
    const singleFiles = document.getElementById('singleFiles');
    const jobDescription = document.getElementById('jobDescription');
    const analyzeButton = document.getElementById('analyzeButton');

    // Initialize drag and drop
    if (dropArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults);
        });

        dropArea.addEventListener('dragenter', () => dropArea.classList.add('bg-blue-50'));
        dropArea.addEventListener('dragleave', () => dropArea.classList.remove('bg-blue-50'));
        dropArea.addEventListener('drop', handleDrop);
    }

    // Initialize file inputs
    if (singleFiles) {
        singleFiles.addEventListener('change', handleFileSelect);
    }
    
    if (resumeFiles) {
        resumeFiles.addEventListener('change', handleFolderSelect);
    }

    // Initialize analyze button
    if (analyzeButton) {
        analyzeButton.addEventListener('click', handleAnalysis);
    }

    // Helper functions
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        preventDefaults(e);
        dropArea.classList.remove('bg-blue-50');
        const files = Array.from(e.dataTransfer.files);
        updateFiles(files);
    }

    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        updateFiles(files);
    }

    function handleFolderSelect(e) {
        const files = Array.from(e.target.files);
        updateFiles(files);
    }

    function updateFiles(files) {
        uploadedFiles = [...uploadedFiles, ...files];
        updateFileList();
    }

    function updateFileList() {
        if (!fileList) return;
        
        fileList.innerHTML = uploadedFiles.map((file, index) => `
            <div class="flex justify-between items-center py-2">
                <span class="text-sm text-gray-600">${file.name}</span>
                <button onclick="removeFile(${index})" class="text-red-500 hover:text-red-700">✕</button>
            </div>
        `).join('');
    }

    async function handleAnalysis(event) {
        event.preventDefault();
        
        if (!uploadedFiles.length) {
            alert('Please upload some resumes first.');
            return;
        }

        const jobDesc = document.getElementById('jobDescription').value.trim();
        if (!jobDesc) {
            alert('Please enter a job description.');
            return;
        }

        const formData = new FormData();
        uploadedFiles.forEach(file => {
            formData.append('resumes[]', file);
        });
        formData.append('job_description', jobDesc);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const results = await response.json();
            if (results.error) {
                throw new Error(results.error);
            }

            // Hide the upload section
            document.querySelector('.content').style.display = 'none';
            
            // Show results
            showAnalysisResults(results);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Analysis failed. Please try again.');
        }
    }

    // Make sure the event listener is properly attached
    document.addEventListener('DOMContentLoaded', function() {
        const analyzeButton = document.getElementById('analyzeButton');
        if (analyzeButton) {
            analyzeButton.addEventListener('click', handleAnalysis);
        }
    });

    // Add after the handleFolderSelect function
    async function handleJobDescriptionPDF(e) {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            const formData = new FormData();
            formData.append('job_description_pdf', file);

            try {
                const response = await fetch('/extract_job_description', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Failed to process PDF');
                
                const data = await response.json();
                document.getElementById('jobDescription').value = data.extracted_text;
                
                // Update the PDF filename display
                document.getElementById('pdfFileName').textContent = file.name;
                document.getElementById('pdfDisplay').classList.remove('hidden');
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to process PDF. Please try copying the text manually.');
            }
        } else {
            alert('Please upload a PDF file');
        }
    }

    // Modify the showAnalysisResults function to update the job description section
    function showAnalysisResults(results) {
        document.title = 'Resume Analysis Dashboard';
        
        const dashboard = document.createElement('div');
        dashboard.className = 'dashboard-container bg-gray-50 min-h-screen py-8';
        dashboard.innerHTML = `
            <div class="container mx-auto px-4">
                <!-- Shortlisted Candidates Dropdown -->
                <div class="mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="p-4 border-b cursor-pointer hover:bg-gray-50" id="shortlistToggle">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <i class="fas fa-star text-yellow-400"></i>
                                <h3 class="text-lg font-semibold text-gray-800">Shortlisted Candidates</h3>
                                <span class="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full" id="shortlistCount">
                                    0 Selected
                                </span>
                            </div>
                            <i class="fas fa-chevron-down text-gray-400 transition-transform" id="shortlistArrow"></i>
                        </div>
                    </div>
                    <div class="hidden" id="shortlistContent">
                        <div class="p-4 space-y-3" id="shortlistedContainer">
                            <!-- Shortlisted candidates will be dynamically added here -->
                            <div class="text-gray-500 text-center py-4">No candidates shortlisted yet</div>
                        </div>
                    </div>
                </div>

                <!-- Existing Dashboard Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div class="mb-4 md:mb-0">
                        <h2 class="text-3xl font-bold text-gray-800">Resume Analysis Dashboard</h2>
                        <p class="text-sm text-gray-600 mt-1">Analysis completed on ${new Date().toLocaleDateString()}</p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <select id="sortCriteria" class="border rounded-lg px-4 py-2 bg-white shadow-sm">
                            <option value="match">Sort by Match %</option>
                            <option value="skills">Sort by Skills</option>
                            <option value="name">Sort by Name</option>
                        </select>
                        <button id="backToUpload" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                            Back to Upload
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div class="lg:col-span-3">
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="candidateList">
                            ${results.map(result => createCandidateCard(result, getCandidateMatchType(result.match_percentage))).join('')}
                        </div>
                    </div>
                    <div class="space-y-6">
                        <div class="bg-white rounded-xl shadow-lg p-6">
                            <h3 class="text-xl font-semibold mb-4">Analysis Summary</h3>
                            <div class="space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-blue-50 rounded-lg p-4">
                                        <p class="text-sm text-gray-600">Total Candidates</p>
                                        <p class="text-2xl font-bold text-blue-600">${results.length}</p>
                                    </div>
                                    <div class="bg-green-50 rounded-lg p-4">
                                        <p class="text-sm text-gray-600">Best Matches</p>
                                        <p class="text-2xl font-bold text-green-600">${results.filter(r => r.match_percentage >= 75).length}</p>
                                    </div>
                                </div>
                                <div class="bg-yellow-50 rounded-lg p-4">
                                    <p class="text-sm text-gray-600">Good Matches</p>
                                    <p class="text-2xl font-bold text-yellow-600">${results.filter(r => r.match_percentage >= 50 && r.match_percentage < 75).length}</p>
                                </div>
                                <div>
                                    <h4 class="font-medium text-gray-700 mb-2">Top Skills Found</h4>
                                    <div class="flex flex-wrap gap-2">
                                        ${getTopSkills(results).split(', ').map(skill => `
                                            <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">${skill}</span>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        
        document.body.appendChild(dashboard);
        initializeDashboard(results);
    }

    function createCandidateCard(result, matchType) {
        return `
            <div class="transform transition-all duration-300 hover:-translate-y-1" data-filename="${result.filename}">
                <div class="p-4 border-2 ${getMatchColor(result.match_percentage)} rounded-xl bg-white">
                    <div class="flex justify-between items-start mb-3">
                        <div class="max-w-[70%]">
                            <h5 class="text-lg font-semibold text-gray-800 truncate">${extractCandidateName(result.filename)}</h5>
                            <p class="text-sm text-gray-500 truncate">${result.filename}</p>
                        </div>
                        <div class="w-16 h-16 flex-shrink-0">
                            ${createMiniProgress(result.match_percentage)}
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="text-sm font-medium text-gray-700 mb-1">Match Score</div>
                        <div class="text-xl font-bold ${getScoreColor(result.match_percentage)}">
                            ${Math.round(result.match_percentage)}%
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="text-sm font-medium text-gray-700 mb-1">Matched Skills</div>
                        <div class="flex flex-wrap gap-1 max-h-[60px] overflow-y-auto">
                            ${result.skills_found.map(skill => `
                                <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full whitespace-nowrap">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="text-sm font-medium text-gray-700 mb-1">Authenticity Score</div>
                        <div class="flex items-center">
                            <div class="text-xl font-bold ${getAuthenticityColor(result.authenticity_score || 0)}">
                                ${Math.round(result.authenticity_score || 0)}%
                            </div>
                            ${(result.authenticity_flags && result.authenticity_flags.length > 0) ? `
                                <button onclick="showFlags('${result.filename}')" 
                                    class="ml-2 text-yellow-500 hover:text-yellow-600">
                                    ⚠️ ${result.authenticity_flags.length} flags
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="flex justify-between items-center mt-4">
                        <button onclick="shortlistCandidate('${result.filename}')" 
                            class="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
                            Shortlist
                        </button>
                        <button onclick="viewDetails('${result.filename}')" 
                            class="text-blue-600 hover:text-blue-700 text-sm">
                            View Details →
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function getCandidateMatchType(percentage) {
        if (percentage >= 75) return 'best';
        if (percentage >= 50) return 'moderate';
        return 'low';
    }

    function getMatchColor(percentage) {
        if (percentage >= 75) return 'border-green-200 hover:border-green-300';
        if (percentage >= 50) return 'border-yellow-200 hover:border-yellow-300';
        return 'border-red-200 hover:border-red-300';
    }

    function extractCandidateName(filename) {
        return filename
            .split('/')
            .pop()
            .replace(/\.[^/.]+$/, '')
            .replace(/[_-]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    function getScoreColor(score) {
        if (score >= 75) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    }

    function getAuthenticityColor(score) {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    }

    // Make functions available globally
    window.removeFile = function(index) {
        uploadedFiles.splice(index, 1);
        updateFileList();
    };

    function createMiniProgress(percentage) {
        const radius = 24;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        const color = percentage >= 75 ? 'text-green-500' :
                     percentage >= 50 ? 'text-yellow-500' : 'text-red-500';
        
        return `
            <svg class="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="${radius}" 
                    class="text-gray-200" 
                    stroke="currentColor"
                    stroke-width="4" 
                    fill="transparent"/>
                <circle cx="32" cy="32" r="${radius}"
                    class="${color}"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${offset}"
                    stroke-linecap="round"
                    fill="transparent"/>
            </svg>
        `;
    }

    function getTopSkills(results) {
        const skillCount = {};
        results.forEach(result => {
            result.skills_found.forEach(skill => {
                skillCount[skill] = (skillCount[skill] || 0) + 1;
            });
        });
        
        return Object.entries(skillCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([skill, count]) => `${skill} (${count})`)
            .join(', ');
    }

    function initializeDashboard(results) {
        const sortCriteria = document.getElementById('sortCriteria');
        const backToUpload = document.getElementById('backToUpload');
        const candidateList = document.getElementById('candidateList');
        globalResults = results; // Store results globally

        // Handle sorting
        if (sortCriteria) {
            sortCriteria.addEventListener('change', () => {
                const sorted = [...results].sort((a, b) => {
                    switch (sortCriteria.value) {
                        case 'match':
                            return b.match_percentage - a.match_percentage;
                        case 'skills':
                            return b.skills_found.length - a.skills_found.length;
                        case 'name':
                            return extractCandidateName(a.filename).localeCompare(extractCandidateName(b.filename));
                        default:
                            return 0;
                    }
                });
                
                if (candidateList) {
                    candidateList.innerHTML = sorted.map(result => 
                        createCandidateCard(result, getCandidateMatchType(result.match_percentage))
                    ).join('');
                }
            });
        }

        // Handle back button
        if (backToUpload) {
            backToUpload.addEventListener('click', () => {
                document.querySelector('.dashboard-container').remove();
                document.querySelector('.content').style.display = 'block';
            });
        }

        // Initialize shortlist functionality
        const shortlistToggle = document.getElementById('shortlistToggle');
        const shortlistContent = document.getElementById('shortlistContent');
        const shortlistArrow = document.getElementById('shortlistArrow');
        
        shortlistToggle.addEventListener('click', () => {
            shortlistContent.classList.toggle('hidden');
            shortlistArrow.classList.toggle('rotate-180');
        });

        // Update shortlist function
        window.shortlistCandidate = function(filename) {
            const candidate = results.find(r => r.filename === filename);
            const shortlistedContainer = document.getElementById('shortlistedContainer');
            const shortlistCount = document.getElementById('shortlistCount');
            const card = document.querySelector(`[data-filename="${filename}"]`);
        
            if (card) {
                const borderElement = card.querySelector('.border-2');
                const isShortlisted = borderElement.classList.toggle('border-blue-500');
                borderElement.classList.toggle('bg-blue-50');
        
                // Get all currently shortlisted candidates
                const currentShortlisted = Array.from(shortlistedContainer.querySelectorAll('.shortlist-item'))
                    .map(item => {
                        const candidateFilename = item.getAttribute('data-filename');
                        return results.find(r => r.filename === candidateFilename);
                    });
        
                if (isShortlisted) {
                    // Add to shortlist
                    const shortlistItem = createShortlistItem(candidate);
                    if (shortlistedContainer.querySelector('.text-gray-500')) {
                        shortlistedContainer.innerHTML = ''; // Remove "No candidates" message
                    }
                    shortlistedContainer.appendChild(shortlistItem);
        
                    // Add new candidate to the list
                    currentShortlisted.push(candidate);

                    // Automatically add candidate email to recipient field
                    const recipientField = document.getElementById('recipientEmail');
                    if (recipientField) {
                        const candidateEmail = candidate.contact?.email || '';
                        recipientField.value = candidateEmail;
                        
                        // Also update the template with candidate name
                        const emailBody = document.getElementById('emailBody');
                        if (emailBody) {
                            let template = emailBody.value;
                            template = template.replace('[Candidate Name]', extractCandidateName(candidate.filename));
                            emailBody.value = template;
                        }
                    }
                } else {
                    // Remove from shortlist
                    const existingItem = shortlistedContainer.querySelector(`[data-filename="${filename}"]`);
                    if (existingItem) existingItem.remove();
        
                    // Remove candidate from the list
                    const index = currentShortlisted.findIndex(c => c.filename === filename);
                    if (index > -1) currentShortlisted.splice(index, 1);
                }
        
                // Dispatch event with all shortlisted candidates
                const shortlistedEvent = new CustomEvent('candidatesShortlisted', {
                    detail: {
                        candidates: currentShortlisted.map(candidate => ({
                            name: extractCandidateName(candidate.filename),
                            email: candidate.contact?.email || 'email@example.com',
                            position: jobDescription.value || 'Position',
                            matchScore: Math.round(candidate.match_percentage)
                        }))
                    }
                });
                document.dispatchEvent(shortlistedEvent);
        
                // Update count
                const currentCount = shortlistedContainer.querySelectorAll('.shortlist-item').length;
                shortlistCount.textContent = `${currentCount} Selected`;
        
                // Show empty message if no candidates
                if (currentCount === 0) {
                    shortlistedContainer.innerHTML = '<div class="text-gray-500 text-center py-4">No candidates shortlisted yet</div>';
                }
            }
        };
        
        function createShortlistItem(candidate) {
            const div = document.createElement('div');
            div.className = 'shortlist-item flex items-center justify-between p-3 bg-blue-50 rounded-lg';
            div.setAttribute('data-filename', candidate.filename);
            
            div.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-blue-500"></i>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-800">${extractCandidateName(candidate.filename)}</h4>
                        <p class="text-sm text-gray-600">${Math.round(candidate.match_percentage)}% Match</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="event.stopPropagation(); viewDetails('${candidate.filename}')" 
                        class="text-sm px-3 py-1 text-blue-600 hover:text-blue-700">
                        View
                    </button>
                    <button onclick="event.stopPropagation(); removeFromShortlist('${candidate.filename}')" 
                        class="text-sm px-3 py-1 text-red-600 hover:text-red-700">
                        Remove
                    </button>
                </div>
            `;
            
            return div;
        }

        // Add this new function for handling remove action
        window.removeFromShortlist = function(filename) {
            const card = document.querySelector(`[data-filename="${filename}"]`);
            if (card) {
                // Remove from shortlist container
                const shortlistedItem = document.querySelector(`#shortlistedContainer [data-filename="${filename}"]`);
                if (shortlistedItem) {
                    shortlistedItem.remove();
                }

                // Update main card styling
                const borderElement = card.querySelector('.border-2');
                if (borderElement) {
                    borderElement.classList.remove('border-blue-500', 'bg-blue-50');
                }

                // Update count
                const shortlistedContainer = document.getElementById('shortlistedContainer');
                const shortlistCount = document.getElementById('shortlistCount');
                const currentCount = shortlistedContainer.querySelectorAll('.shortlist-item').length;
                shortlistCount.textContent = `${currentCount} Selected`;

                // Show empty message if no candidates
                if (currentCount === 0) {
                    shortlistedContainer.innerHTML = '<div class="text-gray-500 text-center py-4">No candidates shortlisted yet</div>';
                }
            }
        };

        window.viewDetails = function(filename) {
            const candidate = results.find(r => r.filename === filename);
            if (candidate) {
                alert(`
Candidate Details:
Name: ${extractCandidateName(filename)}
Match: ${Math.round(candidate.match_percentage)}%
Skills: ${candidate.skills_found.join(', ')}
Experience: ${candidate.experience ? candidate.experience.join('\n') : 'Not specified'}
Education: ${candidate.education ? candidate.education.join('\n') : 'Not specified'}
Contact: ${JSON.stringify(candidate.contact || {}, null, 2)}
                `);
            }
        };
    }

}); // End of DOMContentLoaded

// Add this after processing and analyzing resumes
function updateShortlistedCandidates(shortlistedCandidates) {
    // Dispatch event with shortlisted candidates
    const event = new CustomEvent('candidatesShortlisted', {
        detail: {
            candidates: shortlistedCandidates
        }
    });
    document.dispatchEvent(event);
}

// Call this function after your resume analysis is complete
// Example:
async function analyzeResumes(files, jobDescription) {
    // ... existing resume analysis code ...

    // After getting the results, update the shortlisted candidates
    const shortlistedCandidates = results.filter(candidate => candidate.matchScore >= 70);
    updateShortlistedCandidates(shortlistedCandidates);
}
document.addEventListener('DOMContentLoaded', function() {
    const uploadJobPdfBtn = document.getElementById('uploadJobPdfBtn');
    const jobDescriptionFile = document.getElementById('jobDescriptionFile');
    const jobDescription = document.getElementById('jobDescription');

    uploadJobPdfBtn.addEventListener('click', () => {
        jobDescriptionFile.click();
    });

    jobDescriptionFile.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('pdf', file);

            try {
                const response = await fetch('/api/extract-pdf-text', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Failed to extract text from PDF');

                const data = await response.json();
                jobDescription.value = data.text;
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to extract text from PDF. Please try again or enter text manually.');
            }
        }
    });
});
