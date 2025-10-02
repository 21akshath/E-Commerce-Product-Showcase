// Product Data with new Unsplash images
const products = [
  {id:1, name:"Laptop", price:45000, category:"laptop", image:"https://source.unsplash.com/400x300/?laptop"},
  {id:2, name:"Smartphone", price:18000, category:"smartphone", image:"https://source.unsplash.com/400x300/?smartphone"},
  {id:3, name:"Smart TV", price:32000, category:"electronics", image:"https://source.unsplash.com/400x300/?tv"},
  {id:4, name:"Wireless Earbuds", price:2200, category:"accessories", image:"https://source.unsplash.com/400x300/?earbuds"},
  {id:5, name:"Smart Watch", price:3500, category:"accessories", image:"https://source.unsplash.com/400x300/?smartwatch"},
  {id:6, name:"Tablet", price:15000, category:"tablet", image:"https://source.unsplash.com/400x300/?tablet"},
  {id:7, name:"Bluetooth Speaker", price:2800, category:"electronics", image:"https://source.unsplash.com/400x300/?speaker"},
  {id:8, name:"Gaming Console", price:40000, category:"gaming", image:"https://source.unsplash.com/400x300/?console"},
  {id:9, name:"Digital Camera", price:28000, category:"camera", image:"https://source.unsplash.com/400x300/?camera"},
  {id:10, name:"Fitness Tracker", price:2500, category:"fitness", image:"https://source.unsplash.com/400x300/?fitness-tracker"}
];

// State
let cart = [];
let currentProduct = null;
const reviews = {};

// DOM Elements
const productsContainer = document.getElementById("productsContainer");
const cartCount = document.getElementById("cartCount");
const cartIcon = document.getElementById("cartIcon");

const detailsModal = document.getElementById("detailsModal");
const detailsTitle = document.getElementById("detailsTitle");
const detailsImage = document.getElementById("detailsImage");
const detailsPrice = document.getElementById("detailsPrice");
const reviewsList = document.getElementById("reviewsList");
const reviewInput = document.getElementById("reviewInput");
const starRating = document.getElementById("starRating");
const submitReview = document.getElementById("submitReview");
const addToCartFromDetails = document.getElementById("addToCartFromDetails");

const checkoutModal = document.getElementById("checkoutModal");
const modalCartItems = document.getElementById("modalCartItems");
const modalTotalPrice = document.getElementById("modalTotalPrice");
const confirmCheckout = document.getElementById("confirmCheckout");

const searchBar = document.getElementById("searchBar");
const categoryFilter = document.getElementById("categoryFilter");
const priceSort = document.getElementById("priceSort");

// Render Products: Top 5 + Bottom 5
function renderProducts(list) {
    productsContainer.innerHTML = "";
    const topRow = list.slice(0,5);
    const bottomRow = list.slice(5,10);

    [topRow, bottomRow].forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "product-row";
        row.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ₹${product.price}</p>
                <button onclick="viewDetails(${product.id})">View Details</button>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            rowDiv.appendChild(card);
        });
        productsContainer.appendChild(rowDiv);
    });
}

// Cart
function updateCartCount() {
    cartCount.textContent = cart.length;
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// View Details Modal
function viewDetails(id) {
    currentProduct = products.find(p => p.id === id);
    detailsTitle.textContent = currentProduct.name;
    detailsImage.src = currentProduct.image;
    detailsPrice.textContent = `Price: ₹${currentProduct.price}`;
    renderReviews();
    detailsModal.style.display = "block";
}

// Render Reviews
function renderReviews() {
    const productReviews = reviews[currentProduct.id] || [];
    reviewsList.innerHTML = productReviews.length 
        ? productReviews.map(r => `<li>${"⭐".repeat(r.rating)} - ${r.text}</li>`).join("")
        : "<li>No reviews yet.</li>";
}

// Submit Review
submitReview.addEventListener("click", () => {
    const text = reviewInput.value.trim();
    const rating = parseInt(starRating.value);
    if(!text) return alert("Please enter a review!");
    if(!reviews[currentProduct.id]) reviews[currentProduct.id] = [];
    reviews[currentProduct.id].push({text, rating});
    reviewInput.value = "";
    starRating.value = 1;
    renderReviews();
});

// Add to Cart from Modal
addToCartFromDetails.addEventListener("click", () => {
    addToCart(currentProduct.id);
});

// Close Modals
document.querySelectorAll(".close").forEach(btn => {
    btn.addEventListener("click", () => {
        detailsModal.style.display = "none";
        checkoutModal.style.display = "none";
    });
});

// Checkout Modal
cartIcon.addEventListener("click", () => {
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    renderCheckout();
    checkoutModal.style.display = "block";
});

function renderCheckout() {
    modalCartItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ₹${item.price}`;
        modalCartItems.appendChild(li);
        total += item.price;
    });
    modalTotalPrice.textContent = `Total: ₹${total}`;
}

confirmCheckout.addEventListener("click", () => {
    alert("Your order is confirmed!");
    cart = [];
    updateCartCount();
    checkoutModal.style.display = "none";
});

// Search & Filters
searchBar.addEventListener("input", filterAndSortProducts);
categoryFilter.addEventListener("change", filterAndSortProducts);
priceSort.addEventListener("change", filterAndSortProducts);

function filterAndSortProducts() {
    let filtered = [...products];
    const cat = categoryFilter.value;
    if(cat !== "all") filtered = filtered.filter(p => p.category === cat);

    const term = searchBar.value.toLowerCase();
    if(term) filtered = filtered.filter(p => p.name.toLowerCase().includes(term));

    if(priceSort.value === "low") filtered.sort((a,b)=> a.price - b.price);
    if(priceSort.value === "high") filtered.sort((a,b)=> b.price - a.price);

    renderProducts(filtered);
}

// Initial Render
renderProducts(products);
updateCartCount();


