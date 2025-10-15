const newsData = [
    {
        id: 1,
        title: "Excellence University Ranked #1 in Innovation",
        category: "campus-news",
        excerpt: "Our university has been recognized as the top institution for innovation and research excellence by the National Education Board.",
        date: "2024-03-18",
        author: "University Communications",
        views: 1450,
        featured: false
    },
    {
        id: 2,
        title: "Alumni-Founded Company Goes Public",
        category: "success-stories",
        excerpt: "Tech entrepreneur Michael Chen (Class of 2015) successfully takes his fintech startup public, raising $200M in IPO.",
        date: "2024-03-16",
        author: "Alumni Relations",
        views: 2100,
        featured: false
    },
    {
        id: 3,
        title: "Dr. Emily Rodriguez Wins Nobel Prize",
        category: "achievements",
        excerpt: "Medicine alumna Dr. Emily Rodriguez receives Nobel Prize for her groundbreaking research in cancer treatment.",
        date: "2024-03-14",
        author: "News Team",
        views: 3200,
        featured: false
    },
    {
        id: 4,
        title: "New Science Building Dedicated to Alumni",
        category: "campus-news",
        excerpt: "The state-of-the-art research facility was made possible through generous donations from our alumni community.",
        date: "2024-03-12",
        author: "Campus Development",
        views: 890,
        featured: false
    },
    {
        id: 5,
        title: "Alumni Career Fair Connects 500+ Students",
        category: "events",
        excerpt: "Annual career fair brings together alumni employers and current students for networking and job opportunities.",
        date: "2024-03-10",
        author: "Career Services",
        views: 1200,
        featured: false
    },
    {
        id: 6,
        title: "Partnership with Global Tech Giants Announced",
        category: "partnerships",
        excerpt: "Excellence University partners with leading technology companies to provide internships and research opportunities.",
        date: "2024-03-08",
        author: "Academic Affairs",
        views: 1650,
        featured: false
    },
    {
        id: 7,
        title: "Alumni Scholarship Fund Reaches $10M Milestone",
        category: "achievements",
        excerpt: "Thanks to generous alumni contributions, the scholarship fund has reached a historic milestone of $10 million.",
        date: "2024-03-06",
        author: "Development Office",
        views: 980,
        featured: false
    },
    {
        id: 8,
        title: "Virtual Global Alumni Conference Announced",
        category: "events",
        excerpt: "Join alumni from around the world for our first-ever virtual global conference featuring keynote speakers and networking.",
        date: "2024-03-04",
        author: "Alumni Relations",
        views: 1350,
        featured: false
    }
];

let filteredNews = [...newsData];
let currentCategory = '';

// Initialize news page
document.addEventListener('DOMContentLoaded', function() {
    renderNews();
});

// Render news articles
function renderNews() {
    const articlesGrid = document.getElementById('articlesGrid');
    
    articlesGrid.innerHTML = filteredNews.map(article => {
        const categoryInfo = getCategoryInfo(article.category);
        
        return `
            <article class="article-card">
                <div class="card-header">
                    <span class="article-category" style="background-color: ${categoryInfo.color};">
                        ${categoryInfo.name}
                    </span>
                    <div class="article-meta">
                        <span><i class="fas fa-eye"></i> ${formatViews(article.views)}</span>
                    </div>
                </div>
                <h3 class="card-title">${article.title}</h3>
                <p class="card-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(article.date)}</span>
                    <span><i class="fas fa-user"></i> ${article.author}</span>
                </div>
                <a href="#" class="read-more-btn" onclick="readArticle(${article.id})">
                    Read More
                    <i class="fas fa-arrow-right"></i>
                </a>
            </article>
        `;
    }).join('');
}

// Get category information
function getCategoryInfo(category) {
    const categoryMap = {
        'success-stories': { name: 'Success Story', color: '#10b981' },
        'campus-news': { name: 'Campus News', color: '#3b82f6' },
        'achievements': { name: 'Achievement', color: '#f59e0b' },
        'events': { name: 'Event Highlight', color: '#8b5cf6' },
        'partnerships': { name: 'Partnership', color: '#ef4444' }
    };
    
    return categoryMap[category] || { name: 'News', color: '#6b7280' };
}

// Format date
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format views count
function formatViews(views) {
    if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
}

// Filter by category
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active category
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (category) {
        filteredNews = newsData.filter(article => article.category === category);
        event.target.closest('.category-item').classList.add('active');
    } else {
        filteredNews = [...newsData];
    }
    
    renderNews();
}

// Read article
function readArticle(articleId) {
    const article = newsData.find(a => a.id === articleId);
    if (article) {
        // Increment view count
        article.views++;
        
        // In a real application, this would navigate to the full article page
        alert(`Opening article: "${article.title}"\n\nThis would navigate to the full article page with complete content, images, and related articles.`);
        
        // Update the display
        renderNews();
    }
}

// Subscribe to newsletter
function subscribeNewsletter(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('.newsletter-input').value;
    
    if (validateEmail(email)) {
        // Simulate subscription
        alert('Thank you for subscribing! You will receive our monthly newsletter with the latest alumni news and updates.');
        event.target.querySelector('.newsletter-input').value = '';
    } else {
        alert('Please enter a valid email address.');
    }
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Search functionality (can be added to header)
function searchNews(query) {
    if (!query.trim()) {
        filteredNews = [...newsData];
    } else {
        const searchTerm = query.toLowerCase();
        filteredNews = newsData.filter(article => 
            article.title.toLowerCase().includes(searchTerm) ||
            article.excerpt.toLowerCase().includes(searchTerm) ||
            article.category.toLowerCase().includes(searchTerm)
        );
    }
    
    renderNews();
}

// Add CSS for active category
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .category-item.active {
            background-color: var(--primary-color) !important;
            color: white !important;
        }
    `;
    document.head.appendChild(style);
});

// Simulate real-time updates
function simulateNewsUpdates() {
    // This could be connected to a real-time news feed
    setInterval(() => {
        // Randomly update view counts
        const randomArticle = newsData[Math.floor(Math.random() * newsData.length)];
        randomArticle.views += Math.floor(Math.random() * 10) + 1;
    }, 30000); // Every 30 seconds
}

// Initialize real-time updates
document.addEventListener('DOMContentLoaded', function() {
    simulateNewsUpdates();
});