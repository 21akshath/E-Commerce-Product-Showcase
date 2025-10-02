// Product Data with Unsplash images
const products = [
  {id:1, name:"Wireless Headphones", price:1200, category:"accessories", image:"https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=200&q=80"},
  {id:2, name:"Smart Watch", price:2500, category:"accessories", image:"https://images.unsplash.com/photo-1523475496153-3c25f9f6b16d?auto=format&fit=crop&w=200&q=80"},
  {id:3, name:"Laptop", price:45000, category:"laptop", image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80"},
  {id:4, name:"Smartphone", price:18000, category:"smartphone", image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80"},
  {id:5, name:"Gaming Mouse", price:1500, category:"gaming", image:"https://images.unsplash.com/photo-1606813904140-6c3d5d7a9792?auto=format&fit=crop&w=200&q=80"},
  {id:6, name:"Bluetooth Speaker", price:2200, category:"electronics", image:"https://images.unsplash.com/photo-1570813749830-1425f18f3c53?auto=format&fit=crop&w=200&q=80"},
  {id:7, name:"Digital Camera", price:28000, category:"camera", image:"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=80"},
  {id:8, name:"Tablet", price:12000, category:"tablet", image:"https://images.unsplash.com/photo-1580894732444-34a6f64a5c15?auto=format&fit=crop&w=200&q=80"},
  {id:9, name:"Fitness Tracker", price:3000, category:"fitness", image:"https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=200&q=80"},
  {id:10, name:"Gaming Keyboard", price:3500, category:"gaming", image:"https://images.unsplash.com/photo-1611078485844-5a34b5e7f220?auto=format&fit=crop&w=200&q=80"}
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
