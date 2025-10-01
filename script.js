const products = [
    { name: "Wireless Headphones", price: 1200, image: "https://source.unsplash.com/200x150/?headphones", category: "audio" },
    { name: "Smart Watch", price: 2500, image: "https://source.unsplash.com/200x150/?smartwatch", category: "wearable" },
    { name: "Laptop", price: 45000, image: "https://source.unsplash.com/200x150/?laptop", category: "computers" },
    { name: "Camera", price: 15000, image: "https://source.unsplash.com/200x150/?camera", category: "photography" },
    { name: "Gaming Console", price: 30000, image: "https://source.unsplash.com/200x150/?gaming-console", category: "gaming" },
    { name: "Bluetooth Speaker", price: 2500, image: "https://source.unsplash.com/200x150/?speaker", category: "audio" },
    { name: "Tablet", price: 18000, image: "https://source.unsplash.com/200x150/?tablet", category: "computers" },
    { name: "Smartphone", price: 22000, image: "https://source.unsplash.com/200x150/?smartphone", category: "computers" },
    { name: "Fitness Band", price: 1200, image: "https://source.unsplash.com/200x150/?fitness-band", category: "wearable" },
    { name: "Drone", price: 35000, image: "https://source.unsplash.com/200x150/?drone", category: "drones" }
];

let cartCount = 0;
let currentReviews = [];
let currentRating = 0;

function displayProducts(filteredProducts) {
    const topContainer = document.getElementById('top-products');
    const bottomContainer = document.getElementById('bottom-products');
    topContainer.innerHTML = "";
    bottomContainer.innerHTML = "";

    filteredProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="badge">${product.category}</div>
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: ₹${product.price}</p>
            <div class="buttons">
                <button onclick="viewDetails(${index})">View Details</button>
                <button onclick="addToCart()">Add to Cart</button>
            </div>
        `;
        if(index < 5) topContainer.appendChild(card);
        else bottomContainer.appendChild(card);
    });
}

// Initial display
displayProducts(products);

// Modal logic
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const reviewsDiv = document.getElementById("reviews");
const span = document.getElementsByClassName("close")[0];
const reviewInput = document.getElementById("reviewInput");
const submitReview = document.getElementById("submitReview");
const stars = document.querySelectorAll(".star");

function viewDetails(index) {
    const product = products[index];
    modal.style.display = "block";
    modalBody.innerHTML = `
        <img src="${product.image}" style="width:100%; height:200px; object-fit:cover; border-radius:10px;">
        <h2>${product.name}</h2>
        <p>Price: ₹${product.price}</p>
    `;
    displayReviews();
}

// Close modal
span.onclick = () => { modal.style.display = "none"; reviewInput.value = ""; currentRating = 0; highlightStars(0); }
window.onclick = (e) => { if (e.target === modal) { modal.style.display = "none"; reviewInput.value = ""; currentRating = 0; highlightStars(0); } }

// Add to Cart
function addToCart() {
    cartCount++;
    document.getElementById("cartCount").textContent = cartCount;
}

// Dark/Light mode toggle
const toggleBtn = document.getElementById("toggleTheme");
toggleBtn.onclick = () => {
    document.body.classList.toggle("dark-mode");
    toggleBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
};

// Search, category, sort
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

function filterAndSortProducts() {
    let filtered = products.filter(p => 
        (p.name.toLowerCase().includes(searchInput.value.toLowerCase())) &&
        (categoryFilter.value === "all" || p.category === categoryFilter.value)
    );

    if(sortFilter.value === "low-high") filtered.sort((a,b) => a.price - b.price);
    else if(sortFilter.value === "high-low") filtered.sort((a,b) => b.price - a.price);

    displayProducts(filtered);
}

searchInput.addEventListener("input", filterAndSortProducts);
categoryFilter.addEventListener("change", filterAndSortProducts);
sortFilter.addEventListener("change", filterAndSortProducts);

// Star rating logic
stars.forEach(star => {
    star.addEventListener("mouseover", () => highlightStars(star.dataset.value));
    star.addEventListener("click", () => { currentRating = star.dataset.value; highlightStars(currentRating); });
});

function highlightStars(count){
    stars.forEach(star => star.classList.toggle("active", star.dataset.value <= count));
}

// Submit review
submitReview.onclick = () => {
    const reviewText = reviewInput.value.trim();
    if(reviewText && currentRating > 0){
        currentReviews.push({ text: reviewText, rating: currentRating });
        displayReviews();
        reviewInput.value = "";
        currentRating = 0;
        highlightStars(0);
    } else {
        alert("Please write a review and select a star rating!");
    }
};

function displayReviews(){
    reviewsDiv.innerHTML = currentReviews.map(r => {
        let starsHtml = "⭐".repeat(r.rating) + "☆".repeat(5 - r.rating);
        return `<p>${starsHtml} - ${r.text}</p>`;
    }).join('');
}