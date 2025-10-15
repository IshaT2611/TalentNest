const alumniData = [
    {
        id: 1,
        name: "Sarah Johnson",
        graduationYear: 2020,
        department: "Computer Science",
        currentRole: "Senior Software Engineer",
        company: "Google",
        location: "San Francisco, CA",
        email: "sarah.johnson@email.com",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        bio: "Passionate about AI and machine learning. Leading innovative projects at Google."
    },
    {
        id: 2,
        name: "Michael Chen",
        graduationYear: 2019,
        department: "Business Administration", 
        currentRole: "Product Manager",
        company: "Microsoft",
        location: "Seattle, WA",
        email: "michael.chen@email.com",
        linkedin: "https://linkedin.com/in/michaelchen",
        bio: "Product strategy expert with focus on enterprise solutions."
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        graduationYear: 2021,
        department: "Engineering",
        currentRole: "Mechanical Engineer",
        company: "Tesla",
        location: "Austin, TX",
        email: "emily.rodriguez@email.com",
        linkedin: "https://linkedin.com/in/emilyrodriguez",
        bio: "Working on sustainable transportation solutions and clean energy."
    },
    {
        id: 4,
        name: "David Kim",
        graduationYear: 2018,
        department: "Medicine",
        currentRole: "Cardiologist",
        company: "Mayo Clinic",
        location: "Rochester, MN",
        email: "david.kim@email.com",
        linkedin: "https://linkedin.com/in/davidkim",
        bio: "Specialized in interventional cardiology and heart disease prevention."
    },
    {
        id: 5,
        name: "Jessica Wong",
        graduationYear: 2022,
        department: "Arts & Sciences",
        currentRole: "Data Scientist",
        company: "Netflix",
        location: "Los Angeles, CA",
        email: "jessica.wong@email.com",
        linkedin: "https://linkedin.com/in/jessicawong",
        bio: "Using data analytics to improve content recommendation algorithms."
    },
    {
        id: 6,
        name: "Robert Martinez",
        graduationYear: 2020,
        department: "Business Administration",
        currentRole: "Financial Analyst",
        company: "Goldman Sachs",
        location: "New York, NY",
        email: "robert.martinez@email.com",
        linkedin: "https://linkedin.com/in/robertmartinez",
        bio: "Investment banking professional specializing in tech sector analysis."
    },
    {
        id: 7,
        name: "Lisa Thompson",
        graduationYear: 2019,
        department: "Computer Science",
        currentRole: "UX Designer",
        company: "Apple",
        location: "Cupertino, CA",
        email: "lisa.thompson@email.com",
        linkedin: "https://linkedin.com/in/lisathompson",
        bio: "Creating intuitive user experiences for next-generation products."
    },
    {
        id: 8,
        name: "James Anderson",
        graduationYear: 2021,
        department: "Engineering",
        currentRole: "Civil Engineer",
        company: "Bechtel Corporation",
        location: "Denver, CO",
        email: "james.anderson@email.com",
        linkedin: "https://linkedin.com/in/jamesanderson",
        bio: "Infrastructure development and sustainable construction projects."
    },
    {
        id: 9,
        name: "Maria Garcia",
        graduationYear: 2023,
        department: "Medicine",
        currentRole: "Pediatrician",
        company: "Children's Hospital",
        location: "Boston, MA",
        email: "maria.garcia@email.com",
        linkedin: "https://linkedin.com/in/mariagarcia",
        bio: "Dedicated to improving children's health and wellness."
    },
    {
        id: 10,
        name: "Kevin Lee",
        graduationYear: 2018,
        department: "Computer Science",
        currentRole: "Tech Entrepreneur",
        company: "StartupCo (Founder)",
        location: "Austin, TX",
        email: "kevin.lee@email.com",
        linkedin: "https://linkedin.com/in/kevinlee",
        bio: "Building innovative fintech solutions for small businesses."
    },
    {
        id: 11,
        name: "Amanda White",
        graduationYear: 2020,
        department: "Arts & Sciences",
        currentRole: "Marketing Director",
        company: "Adobe",
        location: "San Jose, CA",
        email: "amanda.white@email.com",
        linkedin: "https://linkedin.com/in/amandawhite",
        bio: "Leading digital marketing strategies and brand development."
    },
    {
        id: 12,
        name: "Daniel Brown",
        graduationYear: 2022,
        department: "Business Administration",
        currentRole: "Management Consultant",
        company: "McKinsey & Company",
        location: "Chicago, IL",
        email: "daniel.brown@email.com",
        linkedin: "https://linkedin.com/in/danielbrown",
        bio: "Helping Fortune 500 companies optimize operations and strategy."
    }
];

let filteredAlumni = [...alumniData];
let currentView = 'grid';
let currentPage = 1;
const itemsPerPage = 12;

// Initialize the directory
document.addEventListener('DOMContentLoaded', function() {
    renderAlumni();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input with debounce
    const searchInput = document.getElementById('searchName');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    });
    
    // Filter change events
    ['graduationYear', 'department', 'location', 'profession'].forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
    
    // Location and profession inputs with debounce
    ['location', 'profession'].forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            let timeout;
            element.addEventListener('input', function() {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    applyFilters();
                }, 500);
            });
        }
    });
}

// Apply filters function
function applyFilters() {
    const searchName = document.getElementById('searchName').value.toLowerCase().trim();
    const graduationYear = document.getElementById('graduationYear').value;
    const department = document.getElementById('department').value;
    const location = document.getElementById('location').value.toLowerCase().trim();
    const profession = document.getElementById('profession').value.toLowerCase().trim();
    
    filteredAlumni = alumniData.filter(alumni => {
        const nameMatch = !searchName || 
            alumni.name.toLowerCase().includes(searchName);
        
        const yearMatch = !graduationYear || 
            alumni.graduationYear.toString() === graduationYear;
        
        const departmentMatch = !department || 
            alumni.department === department;
        
        const locationMatch = !location || 
            alumni.location.toLowerCase().includes(location);
        
        const professionMatch = !profession || 
            alumni.currentRole.toLowerCase().includes(profession) ||
            alumni.company.toLowerCase().includes(profession);
        
        return nameMatch && yearMatch && departmentMatch && locationMatch && professionMatch;
    });
    
    currentPage = 1;
    renderAlumni();
    updateResultsCount();
}

// Clear filters function
function clearFilters() {
    document.getElementById('searchName').value = '';
    document.getElementById('graduationYear').value = '';
    document.getElementById('department').value = '';
    document.getElementById('location').value = '';
    document.getElementById('profession').value = '';
    
    filteredAlumni = [...alumniData];
    currentPage = 1;
    renderAlumni();
    updateResultsCount();
}

// Switch view function
function switchView(view) {
    currentView = view;
    
    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.view-btn').classList.add('active');
    
    // Show/hide appropriate view
    const gridView = document.getElementById('alumniGrid');
    const listView = document.getElementById('alumniList');
    
    if (view === 'grid') {
        gridView.style.display = 'grid';
        listView.style.display = 'none';
    } else {
        gridView.style.display = 'none';
        listView.style.display = 'block';
    }
    
    renderAlumni();
}

// Render alumni function
function renderAlumni() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAlumni = filteredAlumni.slice(startIndex, endIndex);
    
    if (currentAlumni.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    if (currentView === 'grid') {
        renderGridView(currentAlumni);
    } else {
        renderListView(currentAlumni);
    }
    
    renderPagination();
}

// Render grid view
function renderGridView(alumni) {
    const grid = document.getElementById('alumniGrid');
    grid.innerHTML = alumni.map(alumni => `
        <div class="alumni-card">
            <div class="alumni-avatar">
                ${getInitials(alumni.name)}
            </div>
            <h3 class="alumni-name">${alumni.name}</h3>
            <p class="alumni-title">${alumni.currentRole}</p>
            <div class="alumni-details">
                <div class="alumni-detail">
                    <i class="fas fa-building"></i>
                    <span>${alumni.company}</span>
                </div>
                <div class="alumni-detail">
                    <i class="fas fa-graduation-cap"></i>
                    <span>Class of ${alumni.graduationYear}</span>
                </div>
                <div class="alumni-detail">
                    <i class="fas fa-book"></i>
                    <span>${alumni.department}</span>
                </div>
                <div class="alumni-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${alumni.location}</span>
                </div>
            </div>
            <div class="alumni-actions">
                <a href="${alumni.linkedin}" target="_blank" class="action-btn">
                    <i class="fab fa-linkedin"></i>
                    LinkedIn
                </a>
                <button class="action-btn primary" onclick="connectWithAlumni(${alumni.id})">
                    <i class="fas fa-envelope"></i>
                    Connect
                </button>
            </div>
        </div>
    `).join('');
}

// Render list view
function renderListView(alumni) {
    const list = document.getElementById('alumniList');
    list.innerHTML = alumni.map(alumni => `
        <div class="alumni-list-item">
            <div class="list-avatar">
                ${getInitials(alumni.name)}
            </div>
            <div class="list-content">
                <h3 class="alumni-name">${alumni.name}</h3>
                <p class="alumni-title">${alumni.currentRole} at ${alumni.company}</p>
                <div class="alumni-details" style="flex-direction: row; gap: 20px; margin-top: 8px;">
                    <div class="alumni-detail">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Class of ${alumni.graduationYear}</span>
                    </div>
                    <div class="alumni-detail">
                        <i class="fas fa-book"></i>
                        <span>${alumni.department}</span>
                    </div>
                    <div class="alumni-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${alumni.location}</span>
                    </div>
                </div>
            </div>
            <div class="list-actions">
                <a href="${alumni.linkedin}" target="_blank" class="action-btn">
                    <i class="fab fa-linkedin"></i>
                </a>
                <button class="action-btn primary" onclick="connectWithAlumni(${alumni.id})">
                    <i class="fas fa-envelope"></i>
                    Connect
                </button>
            </div>
        </div>
    `).join('');
}

// Get initials from name
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    const total = filteredAlumni.length;
    const start = total > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const end = Math.min(currentPage * itemsPerPage, total);
    
    resultsCount.textContent = `Showing ${start}-${end} of ${total} alumni`;
}

// Show/hide no results
function showNoResults() {
    document.getElementById('noResults').style.display = 'block';
    document.getElementById('alumniGrid').style.display = 'none';
    document.getElementById('alumniList').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
}

function hideNoResults() {
    document.getElementById('noResults').style.display = 'none';
    if (currentView === 'grid') {
        document.getElementById('alumniGrid').style.display = 'grid';
    } else {
        document.getElementById('alumniList').style.display = 'block';
    }
    document.getElementById('pagination').style.display = 'flex';
}

// Pagination functions
function renderPagination() {
    const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // Update prev/next buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Generate page numbers (simplified)
    let paginationHTML = '';
    
    if (currentPage > 1) {
        paginationHTML += `<button onclick="previousPage()"><i class="fas fa-chevron-left"></i> Previous</button>`;
    }
    
    // Show first few pages, current page area, and last few pages
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<button class="${activeClass}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (totalPages > 5) {
        paginationHTML += `<button disabled>...</button>`;
        paginationHTML += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="nextPage()">Next <i class="fas fa-chevron-right"></i></button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderAlumni();
        updateResultsCount();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderAlumni();
        updateResultsCount();
    }
}

function goToPage(page) {
    currentPage = page;
    renderAlumni();
    updateResultsCount();
}

// Connect with alumni function
function connectWithAlumni(alumniId) {
    const alumni = alumniData.find(a => a.id === alumniId);
    if (alumni) {
        // In a real application, this would open a modal or redirect to a messaging system
        const message = `Hello ${alumni.name},\n\nI found your profile in the Excellence University Alumni Directory and would love to connect with you.\n\nBest regards,\n[Your Name]`;
        
        // Create mailto link
        const subject = 'Connection Request - Excellence University Alumni';
        const mailtoLink = `mailto:${alumni.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        
        window.open(mailtoLink);
    }
}