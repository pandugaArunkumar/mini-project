// API Key for NewsAPI (Replace with your actual API Key)
const NEWS_API_KEY = 'c842f73a69d04fea85bc72ad043efdd9'; // Get from https://newsapi.org/

// News API URL - Fetch latest news on climate and weather
const NEWS_API_URL = `https://newsapi.org/v2/everything?q=weather+OR+climate&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;

// Fetch and display weather news
async function fetchNews() {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '<p>Loading latest news...</p>';

    try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();

        if (data.status === 'ok' && data.articles.length > 0) {
            displayNews(data.articles);
        } else {
            newsContainer.innerHTML = '<p>No news available at this time.</p>';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
    }
}

// Display news articles in HTML
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Clear previous content

    // Loop through the first 5 articles
    articles.slice(0, 5).forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
            <p>${article.description || 'No description available.'}</p>
            <p><strong>Source:</strong> ${article.source.name} | <strong>Published:</strong> ${new Date(article.publishedAt).toLocaleDateString()}</p>
        `;
        newsContainer.appendChild(newsItem);
    });
}

// Call the function to fetch news on page load
window.onload = fetchNews;