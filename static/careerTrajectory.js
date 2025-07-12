class CareerTrajectorySimulator {
    constructor() {
        this.searchInput = document.getElementById('careerSearch');
        this.cardsContainer = document.getElementById('trajectoryCards');
        this.initializeEventListeners();
        // Add PDF input element
        this.createPdfInput();
        this.careerPaths = {
            'software engineer': {
                current: {
                    role: 'Software Engineer',
                    experience: '3 Years Experience',
                    skills: 'Full Stack Development, JavaScript, Python, React'
                },
                projection: {
                    path: 'Tech Lead → Engineering Manager → Director of Engineering',
                    specialization: 'AI/ML Integration Specialist, Cloud Architecture',
                    growth: '95',
                    timeframe: {
                        'Year 1-2': 'Senior Software Engineer',
                        'Year 3-4': 'Tech Lead',
                        'Year 5': 'Engineering Manager'
                    }
                },
                market: {
                    demand: 'Very High Demand (95th percentile)',
                    sectors: 'AI/ML, Cloud Computing, FinTech',
                    salary: {
                        current: '95,000',
                        projected: '180,000',
                        growth: '89'
                    }
                }
            },
            'data scientist': {
                current: {
                    role: 'Data Scientist',
                    experience: '2 Years Experience',
                    skills: 'Python, ML, Statistical Analysis, Deep Learning'
                },
                projection: {
                    path: 'Senior Data Scientist → ML Engineer → AI Architect',
                    specialization: 'Deep Learning Expert, NLP Specialist',
                    growth: '92',
                    timeframe: {
                        'Year 1-2': 'Senior Data Scientist',
                        'Year 3-4': 'ML Engineer',
                        'Year 5': 'AI Architect'
                    }
                },
                market: {
                    demand: 'Very High Demand (92nd percentile)',
                    sectors: 'AI Research, Healthcare AI, Autonomous Systems',
                    salary: {
                        current: '90,000',
                        projected: '175,000',
                        growth: '94'
                    }
                }
            }
        };
    }

    simulateCareerPath(searchTerm) {
        const path = this.careerPaths[searchTerm.toLowerCase()] || this.generateDynamicPath(searchTerm);
        this.updateUI(path);
        this.animateGrowthMetrics(path);
    }

    generateDynamicPath(role) {
        const industries = this.analyzeIndustry(role);
        const projections = this.calculateProjections(role);
        const marketData = this.analyzeMarketTrends(role);

        return {
            current: {
                role: this.capitalizeWords(role) || 'Role Not Found',
                experience: this.determineExperience(role),
                skills: this.determineSkills(role)
            },
            projection: {
                path: projections.careerPath,
                specialization: projections.specialization,
                growth: projections.growthPotential,
                timeframe: projections.timeline
            },
            market: {
                demand: marketData.demand,
                sectors: industries.join(', '),
                salary: marketData.salary
            }
        };
    }

    analyzeIndustry(role) {
        const industryMap = {
            'developer': ['Cloud Computing', 'FinTech', 'E-commerce'],
            'analyst': ['Business Intelligence', 'Data Analytics', 'Finance'],
            'designer': ['UX/UI', 'Product Design', 'Digital Marketing'],
            'manager': ['Technology Management', 'Digital Transformation', 'Innovation']
        };

        return Object.entries(industryMap)
            .filter(([key]) => role.toLowerCase().includes(key))
            .map(([, industries]) => industries)[0] || ['Technology', 'Digital Services'];
    }

    calculateProjections(role) {
        const baseGrowth = 85;
        const marketDemand = this.getMarketDemand(role);
        const growthPotential = Math.min(98, baseGrowth + marketDemand);

        return {
            careerPath: this.generateCareerPath(role),
            specialization: this.determineSpecialization(role),
            growthPotential: growthPotential,
            timeline: this.generateTimeline(role)
        };
    }

    analyzeMarketTrends(role) {
        const baseSalary = this.determineBaseSalary(role);
        const growthRate = this.calculateGrowthRate(role);
        const projectedSalary = Math.round(baseSalary * (1 + growthRate));

        return {
            demand: this.formatDemand(this.getMarketDemand(role)),
            salary: {
                current: baseSalary.toLocaleString(),
                projected: projectedSalary.toLocaleString(),
                growth: Math.round(growthRate * 100)
            }
        };
    }

    initializeEventListeners() {
        this.searchInput.addEventListener('input', this.debounce(() => {
            this.simulateCareerPath(this.searchInput.value);
        }, 300));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    updateUI(careerPath) {
        this.cardsContainer.innerHTML = `
            <!-- Current Profile card remains the same -->
            ${this.createCurrentProfileCard(careerPath)}

            <!-- Updated 5 Year Projection -->
            ${this.createProjectionCard(careerPath)}

            <!-- Updated Market Alignment -->
            <div class="career-card bg-white p-6 rounded-xl shadow-md">
                <div class="flex items-center gap-3 mb-4">
                    <i class="fas fa-globe text-2xl text-green-500"></i>
                    <h3 class="text-xl font-semibold">Market Alignment</h3>
                </div>
                <div class="space-y-3 text-gray-600">
                    <p class="flex items-center gap-2">
                        <i class="fas fa-check-circle text-sm text-green-500"></i>
                        <span class="demand">${careerPath.market.demand}</span>
                    </p>
                    <p class="flex items-center gap-2">
                        <i class="fas fa-industry text-sm"></i>
                        <span class="sectors">${careerPath.market.sectors}</span>
                    </p>
                    <div class="border-t pt-2 mt-2">
                        <p class="text-sm font-medium mb-1">Salary Projection</p>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs text-gray-500">Current</p>
                                <p class="text-lg font-semibold">$${careerPath.market.salary.current}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500">5 Year Projection</p>
                                <p class="text-lg font-semibold text-green-600">$${careerPath.market.salary.projected}</p>
                            </div>
                        </div>
                        <p class="text-sm text-green-600 mt-1">
                            <i class="fas fa-arrow-up text-xs"></i>
                            ${careerPath.market.salary.growth}% Growth
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    createCurrentProfileCard(careerPath) {
        return `
            <div class="career-card bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                <div class="flex items-center gap-3 mb-4">
                    <i class="fas fa-user-circle text-2xl text-blue-500"></i>
                    <h3 class="text-xl font-semibold">Current Profile</h3>
                </div>
                <div class="space-y-2 text-gray-600">
                    <p class="flex items-center gap-2">
                        <i class="fas fa-briefcase text-sm"></i>
                        <span class="role">${careerPath.current.role}</span>
                    </p>
                    <p class="flex items-center gap-2">
                        <i class="fas fa-clock text-sm"></i>
                        <span class="experience">${careerPath.current.experience}</span>
                    </p>
                    <p class="flex items-center gap-2">
                        <i class="fas fa-code text-sm"></i>
                        <span class="skills">${careerPath.current.skills}</span>
                    </p>
                </div>
            </div>
        `;
    }

    createProjectionCard(careerPath) {
        return `
            <div class="career-card bg-white p-6 rounded-xl shadow-md relative">
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm">
                    AI Predicted Path
                </div>
                
                <!-- Career Progress Visualization -->
                <div class="relative h-2 bg-gray-200 rounded-full mb-8 mt-4">
                    <div class="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                         style="width: ${careerPath.projection.growth}%">
                    </div>
                    <div class="absolute -top-8 left-0">Entry Level</div>
                    <div class="absolute -top-8 right-0">Expert Level</div>
                </div>

                <!-- Skill Evolution Chart -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 class="text-sm font-semibold mb-3">Skill Evolution</h4>
                    <div class="space-y-2">
                        ${this.generateSkillEvolutionBars(careerPath)}
                    </div>
                </div>

                <!-- Interactive Timeline -->
                <div class="relative py-4 mb-6">
                    <div class="absolute left-0 w-full h-1 bg-gray-200 top-1/2 transform -translate-y-1/2"></div>
                    ${Object.entries(careerPath.projection.timeframe).map(([year, position], index) => `
                        <div class="relative flex items-center justify-center" style="margin-left: ${index * 33}%">
                            <div class="w-4 h-4 rounded-full bg-purple-500 z-10"></div>
                            <div class="absolute top-6 transform -translate-x-1/2 text-sm">
                                <div class="font-medium text-purple-600">${year}</div>
                                <div class="text-gray-600 text-xs">${position}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Market Impact Radar -->
                <div class="flex justify-between items-center mb-6">
                    <div class="text-center flex-1">
                        <div class="inline-block p-3 rounded-full bg-blue-100">
                            <i class="fas fa-chart-line text-blue-500"></i>
                        </div>
                        <div class="text-sm mt-2">Growth<br>Potential</div>
                        <div class="font-bold text-blue-500">${careerPath.projection.growth}%</div>
                    </div>
                    <div class="text-center flex-1">
                        <div class="inline-block p-3 rounded-full bg-green-100">
                            <i class="fas fa-users text-green-500"></i>
                        </div>
                        <div class="text-sm mt-2">Market<br>Demand</div>
                        <div class="font-bold text-green-500">High</div>
                    </div>
                    <div class="text-center flex-1">
                        <div class="inline-block p-3 rounded-full bg-purple-100">
                            <i class="fas fa-brain text-purple-500"></i>
                        </div>
                        <div class="text-sm mt-2">Skill<br>Match</div>
                        <div class="font-bold text-purple-500">92%</div>
                    </div>
                </div>

                <!-- Rest of the existing content -->
                <div class="space-y-3 text-gray-600">
                    <p class="flex items-center gap-2">
                        <i class="fas fa-arrow-trend-up text-sm text-green-500"></i>
                        <span class="career-path">${careerPath.projection.path}</span>
                    </p>
                    <p class="flex items-center gap-2 mt-3">
                        <i class="fas fa-lightbulb text-sm text-yellow-500"></i>
                        <span class="specialization">${careerPath.projection.specialization}</span>
                    </p>
                </div>
            </div>
        `;
    }

    // Add this new helper method for skill evolution visualization
    generateSkillEvolutionBars(careerPath) {
        const skills = careerPath.current.skills.split(', ').slice(0, 3);
        return skills.map(skill => `
            <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between">
                    <div class="text-xs font-semibold text-gray-600">${skill}</div>
                    <div class="text-xs font-semibold text-gray-600">
                        <span class="text-green-500">+${Math.floor(Math.random() * 30 + 70)}%</span>
                    </div>
                </div>
                <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-400 to-blue-500" 
                         style="width: ${Math.floor(Math.random() * 30 + 70)}%">
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Add after the createProjectionCard method
    
    createSkillsSection(careerPath) {
        return `
            <div class="career-card bg-white p-6 rounded-xl shadow-md mt-8">
                <div class="flex items-center gap-3 mb-6">
                    <i class="fas fa-graduation-cap text-2xl text-indigo-500"></i>
                    <h3 class="text-xl font-semibold">Skills & Certifications</h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Required Skills -->
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold mb-4">Required Skills</h4>
                        <div class="space-y-3">
                            ${this.generateRequiredSkills(careerPath)}
                        </div>
                    </div>

                    <!-- Recommended Certifications -->
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold mb-4">Recommended Certifications</h4>
                        <div class="space-y-3">
                            ${this.generateCertifications(careerPath)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createIndustrySection(careerPath) {
        return `
            <div class="career-card bg-white p-6 rounded-xl shadow-md mt-8">
                <div class="flex items-center gap-3 mb-6">
                    <i class="fas fa-chart-network text-2xl text-blue-500"></i>
                    <h3 class="text-xl font-semibold">Industry Insights</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Industry Trends -->
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold mb-4">Emerging Trends</h4>
                        <div id="trendChart" class="h-48 mb-4"></div>
                        <div class="space-y-2">
                            ${this.generateIndustryTrends(careerPath)}
                        </div>
                    </div>

                    <!-- Geographic Opportunities -->
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold mb-4">Top Locations</h4>
                        <div class="space-y-3">
                            ${this.generateLocationOpportunities(careerPath)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createCompensationSection(careerPath) {
        return `
            <div class="career-card bg-white p-6 rounded-xl shadow-md mt-8">
                <div class="flex items-center gap-3 mb-6">
                    <i class="fas fa-money-bill-trend-up text-2xl text-green-500"></i>
                    <h3 class="text-xl font-semibold">Compensation Analysis</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Salary Trends -->
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold mb-4">Salary Range by Experience</h4>
                        <div id="salaryChart" class="h-48 mb-4"></div>
                        <div class="text-sm text-gray-600 mt-2">
                            Based on industry data and market analysis
                        </div>
                    </div>

                    <!-- Benefits & Perks -->
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold mb-4">Common Benefits</h4>
                        <div class="space-y-3">
                            ${this.generateBenefitsAnalysis(careerPath)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Add after createCompensationSection method
    createRecruitmentSection(careerPath) {
        return `
            <div class="career-card bg-white p-6 rounded-xl shadow-md mt-8">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-envelope text-2xl text-blue-500"></i>
                        <h3 class="text-xl font-semibold">Recruitment Communication</h3>
                    </div>
                    <button 
                        onclick="window.sendRecruitmentEmail()"
                        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300">
                        <i class="fas fa-paper-plane"></i>
                        Send Interview Invitation
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Email Template -->
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold mb-4">Email Template</h4>
                        <div class="space-y-3">
                            <textarea 
                                id="emailTemplate"
                                class="w-full h-48 p-3 border rounded-lg resize-none"
                                placeholder="Dear [Candidate Name],

We are impressed with your profile and would like to invite you for an interview for the [Position] role at our company.

Best regards,
[Your Name]"
                            ></textarea>
                        </div>
                    </div>

                    <!-- Candidate Details -->
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold mb-4">Candidate Details</h4>
                        <div class="space-y-3">
                            <div class="flex flex-col gap-2">
                                <label class="text-sm text-gray-600">Candidate Email</label>
                                <input 
                                    type="email" 
                                    id="candidateEmail"
                                    class="p-2 border rounded-lg"
                                    placeholder="candidate@example.com"
                                >
                            </div>
                            <div class="flex flex-col gap-2">
                                <label class="text-sm text-gray-600">Position</label>
                                <input 
                                    type="text" 
                                    id="position"
                                    class="p-2 border rounded-lg"
                                    value="${careerPath.current.role}"
                                    readonly
                                >
                            </div>
                            <div class="flex flex-col gap-2">
                                <label class="text-sm text-gray-600">Interview Date</label>
                                <input 
                                    type="datetime-local" 
                                    id="interviewDate"
                                    class="p-2 border rounded-lg"
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Add to updateUI method
    updateUI(careerPath) {
        this.cardsContainer.innerHTML = `
            <!-- Current Profile card remains the same -->
            ${this.createCurrentProfileCard(careerPath)}

            <!-- Updated 5 Year Projection -->
            ${this.createProjectionCard(careerPath)}

            <!-- Updated Market Alignment -->
            <div class="career-card bg-white p-6 rounded-xl shadow-md">
                <div class="flex items-center gap-3 mb-4">
                    <i class="fas fa-globe text-2xl text-green-500"></i>
                    <h3 class="text-xl font-semibold">Market Alignment</h3>
                </div>
                <div class="space-y-3 text-gray-600">
                    <p class="flex items-center gap-2">
                        <i class="fas fa-check-circle text-sm text-green-500"></i>
                        <span class="demand">${careerPath.market.demand}</span>
                    </p>
                    <p class="flex items-center gap-2">
                        <i class="fas fa-industry text-sm"></i>
                        <span class="sectors">${careerPath.market.sectors}</span>
                    </p>
                    <div class="border-t pt-2 mt-2">
                        <p class="text-sm font-medium mb-1">Salary Projection</p>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs text-gray-500">Current</p>
                                <p class="text-lg font-semibold">$${careerPath.market.salary.current}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500">5 Year Projection</p>
                                <p class="text-lg font-semibold text-green-600">$${careerPath.market.salary.projected}</p>
                            </div>
                        </div>
                        <p class="text-sm text-green-600 mt-1">
                            <i class="fas fa-arrow-up text-xs"></i>
                            ${careerPath.market.salary.growth}% Growth
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    // Add this method to handle email sending
    async sendRecruitmentEmail() {
        const emailTemplate = document.getElementById('emailTemplate').value;
        const candidateEmail = document.getElementById('candidateEmail').value;
        const position = document.getElementById('position').value;
        const interviewDate = document.getElementById('interviewDate').value;

        if (!emailTemplate || !candidateEmail || !interviewDate) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/send-recruitment-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    template: emailTemplate,
                    email: candidateEmail,
                    position: position,
                    interviewDate: interviewDate
                })
            });

            if (!response.ok) throw new Error('Failed to send email');

            alert('Interview invitation sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email. Please try again.');
        }
    }

    initializeCharts(careerPath) {
        // Initialize D3.js charts here
        this.createTrendChart();
        this.createSalaryChart();
    }

    capitalizeWords(str) 
    {
        return str.replace(/\b\w/g, c => c.toUpperCase());
    }

    determineExperience(role) 
    {
        const experienceMap = {
            'junior': '1-2 Years',
            'senior': '5+ Years',
            'lead': '7+ Years',
            'manager': '8+ Years',
            'director': '10+ Years'
        };

        for (const [level, exp] of Object.entries(experienceMap)) {
            if (role.toLowerCase().includes(level)) return exp;
        }
        return '3-5 Years';
    }

    determineSkills(role)
    {
        const skillsMap = {
            'developer': ['JavaScript', 'Python', 'React', 'Node.js', 'Git'],
            'engineer': ['System Design', 'Cloud Services', 'CI/CD', 'DevOps'],
            'analyst': ['SQL', 'Python', 'Data Visualization', 'Statistical Analysis'],
            'designer': ['UI/UX', 'Figma', 'Adobe Creative Suite', 'User Research'],
            'scientist': ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow'],
            'manager': ['Project Management', 'Agile', 'Team Leadership', 'Strategic Planning']
        };

        const relevantSkills = Object.entries(skillsMap)
            .filter(([key]) => role.toLowerCase().includes(key))
            .map(([, skills]) => skills)
            .flat();

        return relevantSkills.length ? relevantSkills.join(', ') : 'Core technical skills pending analysis';
    }

    generateCareerPath(role) 
    {
        const careerLadder = {
            'developer': ['Senior Developer', 'Tech Lead', 'Engineering Manager'],
            'engineer': ['Senior Engineer', 'Lead Engineer', 'Engineering Director'],
            'analyst': ['Senior Analyst', 'Analytics Manager', 'Director of Analytics'],
            'designer': ['Senior Designer', 'Design Lead', 'Design Director'],
            'scientist': ['Senior Scientist', 'Lead Scientist', 'Research Director'],
            'manager': ['Senior Manager', 'Director', 'VP']
        };

        for (const [key, path] of Object.entries(careerLadder)) {
            if (role.toLowerCase().includes(key)) {
                return path.join(' → ');
            }
        }
        return 'Career progression path will be analyzed based on role specifics';
    }

    determineSpecialization(role) 
    {
        const specializationMap = {
            'developer': ['Full Stack Architecture', 'Cloud Solutions', 'AI Integration'],
            'engineer': ['Systems Architecture', 'Cloud Infrastructure', 'DevOps Excellence'],
            'analyst': ['Advanced Analytics', 'Predictive Modeling', 'Business Intelligence'],
            'designer': ['Product Design', 'Design Systems', 'UX Strategy'],
            'scientist': ['Deep Learning', 'NLP', 'Computer Vision'],
            'manager': ['Digital Transformation', 'Innovation Leadership', 'Strategic Operations']
        };

        for (const [key, specs] of Object.entries(specializationMap)) {
            if (role.toLowerCase().includes(key)) {
                return specs.join(', ');
            }
        }
        return 'Specialization opportunities pending analysis';
    }

    generateTimeline(role) 
    {
        const baseTimeline = {
            'Year 1-2': 'Role Mastery',
            'Year 3-4': 'Leadership Development',
            'Year 5': 'Strategic Position'
        };

        const roleSpecificTimeline = this.generateRoleSpecificTimeline(role);
        return { ...baseTimeline, ...roleSpecificTimeline };
    }

    generateRoleSpecificTimeline(role) 
    {
        const timelineMap = {
            'developer': {
                'Year 1-2': 'Senior Developer',
                'Year 3-4': 'Tech Lead',
                'Year 5': 'Engineering Manager'
            },
            'analyst': {
                'Year 1-2': 'Senior Analyst',
                'Year 3-4': 'Lead Analyst',
                'Year 5': 'Analytics Manager'
            }
            // Add more role-specific timelines
        };

        for (const [key, timeline] of Object.entries(timelineMap)) {
            if (role.toLowerCase().includes(key)) return timeline;
        }
        return {};
    }

    getMarketDemand(role) 
    {
        const demandScores = {
            'developer': 92,
            'engineer': 90,
            'analyst': 85,
            'scientist': 88,
            'designer': 82,
            'manager': 80
        };

        for (const [key, score] of Object.entries(demandScores)) {
            if (role.toLowerCase().includes(key)) return score;
        }
        return 75;
    }

    determineBaseSalary(role) 
    {
        const baseSalaries = {
            'developer': 85000,
            'engineer': 90000,
            'analyst': 75000,
            'scientist': 95000,
            'designer': 70000,
            'manager': 100000
        };

        for (const [key, salary] of Object.entries(baseSalaries)) {
            if (role.toLowerCase().includes(key)) return salary;
        }
        return 65000;
    }

    calculateGrowthRate(role) 
    {
        const baseGrowth = 0.15;
        const marketDemand = this.getMarketDemand(role) / 100;
        return baseGrowth + (marketDemand * 0.1);
    }

    formatDemand(score) 
    {
        if (score >= 90) return `Very High Demand (${score}th percentile)`;
        if (score >= 80) return `High Demand (${score}th percentile)`;
        if (score >= 70) return `Moderate Demand (${score}th percentile)`;
        return `Growing Demand (${score}th percentile)`;
    }

    animateGrowthMetrics(path) 
    {
        const growthElement = document.getElementById('growthPotential');
        if (growthElement) {
            let current = 0;
            const target = parseInt(path.projection.growth);
            const duration = 1500;
            const increment = (target / duration) * 16;

            const animation = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(animation);
                }
                growthElement.textContent = `${Math.round(current)}% Growth Potential`;
            }, 16);
        }
    }
}


// Add this new method
createPdfInput() 
{
        const inputContainer = document.createElement('div');
        inputContainer.className = 'flex items-center gap-4 mt-4 justify-center';
        inputContainer.innerHTML = `
            <div class="relative">
                <input type="file" 
                    id="pdfInput" 
                    accept=".pdf" 
                    class="hidden">
                <button 
                    id="pdfButton"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300">
                    <i class="fas fa-file-pdf"></i>
                    Upload Resume (PDF)
                </button>
            </div>
            <div id="pdfStatus" class="text-sm text-gray-600"></div>
        `;

        this.searchInput.parentNode.appendChild(inputContainer);
        
        // Fix the event listeners
        document.getElementById('pdfInput').addEventListener('change', (event) => {
            this.simulateCareerPathFromPdf(event);
        });
        
        document.getElementById('pdfButton').addEventListener('click', () => {
            document.getElementById('pdfInput').click();
        });
    }

// Add this method to handle PDF processing
// Fix the duplicate curly brace and bind issue
     simulateCareerPathFromPdf(event) 
    {
        const file = event.target.files[0];
        if (!file) return;

        const statusEl = document.getElementById('pdfStatus');
        statusEl.textContent = 'Processing PDF...';
        
        try {
            const formData = new FormData();
            formData.append('pdf', file);

            const response = await fetch('/api/parse-pdf', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to process PDF');

            const data = await response.json();
            this.searchInput.value = data.role;
            this.simulateCareerPath(data.role);
            statusEl.textContent = 'PDF processed successfully!';
            
            setTimeout(() => {
                statusEl.textContent = '';
            }, 3000);

        } catch (error) {
            console.error('Error processing PDF:', error);
            statusEl.textContent = 'Error processing PDF. Please try again.';
        }
    }