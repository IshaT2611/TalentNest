const eventsData = [
    {
        id: 1,
        title: "Annual Alumni Reunion 2024",
        description: "Join us for our biggest reunion event with networking, dinner, and entertainment.",
        date: "2024-04-15",
        time: "6:00 PM - 11:00 PM",
        location: "Grand Hotel Ballroom, Downtown Campus",
        category: "Reunion",
        attendees: 250,
        maxAttendees: 300,
        price: "Free",
        status: "upcoming"
    },
    {
        id: 2,
        title: "Career Development Workshop",
        description: "Interactive workshop on modern career strategies and professional growth.",
        date: "2024-03-20",
        time: "2:00 PM - 5:00 PM",
        location: "Innovation Center, Main Campus",
        category: "Workshop",
        attendees: 45,
        maxAttendees: 60,
        price: "$25",
        status: "upcoming"
    },
    {
        id: 3,
        title: "Tech Alumni Meetup",
        description: "Monthly meetup for tech professionals to share insights and network.",
        date: "2024-03-25",
        time: "7:00 PM - 9:00 PM",
        location: "TechHub Co-working Space",
        category: "Networking",
        attendees: 30,
        maxAttendees: 50,
        price: "Free",
        status: "upcoming"
    },
    {
        id: 4,
        title: "Mentorship Program Launch",
        description: "Launch event for our new alumni-student mentorship program.",
        date: "2024-04-05",
        time: "5:00 PM - 7:00 PM",
        location: "Student Union Building",
        category: "Mentorship",
        attendees: 75,
        maxAttendees: 100,
        price: "Free",
        status: "upcoming"
    },
    {
        id: 5,
        title: "Global Alumni Virtual Conference",
        description: "Virtual conference connecting alumni worldwide with keynote speakers and panels.",
        date: "2024-05-10",
        time: "10:00 AM - 4:00 PM",
        location: "Online Event",
        category: "Conference",
        attendees: 150,
        maxAttendees: 500,
        price: "$50",
        status: "upcoming"
    },
    {
        id: 6,
        title: "Alumni Golf Tournament",
        description: "Annual charity golf tournament supporting student scholarships.",
        date: "2024-06-15",
        time: "8:00 AM - 3:00 PM",
        location: "Greenview Golf Club",
        category: "Recreation",
        attendees: 80,
        maxAttendees: 120,
        price: "$150",
        status: "upcoming"
    }
];

let filteredEvents = [...eventsData];

// Initialize events page
document.addEventListener('DOMContentLoaded', function() {
    renderEvents();
    setupEventFilters();
});

// Setup event filters
function setupEventFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const monthFilter = document.getElementById('monthFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyEventFilters);
    }
    
    if (monthFilter) {
        monthFilter.addEventListener('change', applyEventFilters);
    }
}

// Apply event filters
function applyEventFilters() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const selectedMonth = document.getElementById('monthFilter').value;
    
    filteredEvents = eventsData.filter(event => {
        const matchesCategory = !selectedCategory || event.category === selectedCategory;
        const eventMonth = formatEventMonth(event.date);
        const matchesMonth = !selectedMonth || eventMonth === selectedMonth;
        
        return matchesCategory && matchesMonth;
    });
    
    renderEvents();
}

// Format event month
function formatEventMonth(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long' });
}

// Format event date
function formatEventDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get category color
function getCategoryColor(category) {
    const colors = {
        "Reunion": "#ef4444",
        "Workshop": "#3b82f6", 
        "Networking": "#10b981",
        "Mentorship": "#8b5cf6",
        "Conference": "#f59e0b",
        "Recreation": "#ec4899"
    };
    return colors[category] || "#6b7280";
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        "Reunion": "fas fa-users",
        "Workshop": "fas fa-chalkboard-teacher",
        "Networking": "fas fa-handshake",
        "Mentorship": "fas fa-user-graduate",
        "Conference": "fas fa-microphone",
        "Recreation": "fas fa-golf-ball"
    };
    return icons[category] || "fas fa-calendar";
}

// Calculate attendance percentage
function getAttendancePercentage(attendees, maxAttendees) {
    return Math.round((attendees / maxAttendees) * 100);
}

// Render events
function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    
    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-calendar-times" style="font-size: 4rem; color: var(--border); margin-bottom: 20px;"></i>
                <h3>No events found</h3>
                <p>Try adjusting your filters or check back later for new events.</p>
            </div>
        `;
        return;
    }
    
    eventsGrid.innerHTML = filteredEvents.map(event => {
        const attendancePercentage = getAttendancePercentage(event.attendees, event.maxAttendees);
        const categoryColor = getCategoryColor(event.category);
        const categoryIcon = getCategoryIcon(event.category);
        
        return `
            <div class="event-card">
                <div class="event-image" style="background: linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd);">
                    <i class="${categoryIcon}"></i>
                </div>
                <div class="event-content">
                    <div class="event-header">
                        <span class="event-category" style="background-color: ${categoryColor}20; color: ${categoryColor};">
                            ${event.category}
                        </span>
                        <span class="event-price">
                            ${event.price}
                        </span>
                    </div>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    
                    <div class="event-details">
                        <div class="event-detail">
                            <i class="fas fa-calendar"></i>
                            <span>${formatEventDate(event.date)}</span>
                        </div>
                        <div class="event-detail">
                            <i class="fas fa-clock"></i>
                            <span>${event.time}</span>
                        </div>
                        <div class="event-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                    </div>
                    
                    <div class="attendees-info">
                        <i class="fas fa-users"></i>
                        <span>${event.attendees} / ${event.maxAttendees} attendees</span>
                    </div>
                    
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${attendancePercentage}%; background-color: ${categoryColor};"></div>
                    </div>
                    
                    <div class="event-actions">
                        <button class="btn btn-primary" onclick="registerForEvent(${event.id})" style="flex: 1;">
                            <i class="fas fa-user-plus"></i>
                            Register Now
                        </button>
                        <button class="btn btn-secondary" onclick="shareEvent(${event.id})">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="btn btn-secondary" onclick="addToCalendar(${event.id})">
                            <i class="fas fa-calendar-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Register for event
function registerForEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        if (event.attendees >= event.maxAttendees) {
            alert('Sorry, this event is fully booked. You can join the waiting list.');
            return;
        }
        
        // Simulate registration process
        const confirmed = confirm(`Register for "${event.title}"?\n\nDate: ${formatEventDate(event.date)}\nTime: ${event.time}\nLocation: ${event.location}\nPrice: ${event.price}`);
        
        if (confirmed) {
            // In a real application, this would make an API call
            alert('Registration successful! You will receive a confirmation email shortly.');
            
            // Update attendee count (simulate)
            event.attendees++;
            renderEvents();
        }
    }
}

// Share event
function shareEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        const shareData = {
            title: event.title,
            text: `Join me at ${event.title} - ${event.description}`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback: copy to clipboard
            const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Event details copied to clipboard!');
            });
        }
    }
}

// Add to calendar
function addToCalendar(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        const startDate = new Date(event.date);
        const endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
        
        const calendarData = {
            title: event.title,
            start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
            end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
            description: event.description,
            location: event.location
        };
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.title)}&dates=${calendarData.start}/${calendarData.end}&details=${encodeURIComponent(calendarData.description)}&location=${encodeURIComponent(calendarData.location)}`;
        
        window.open(googleCalendarUrl, '_blank');
    }
}