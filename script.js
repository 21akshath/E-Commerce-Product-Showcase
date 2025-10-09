const products = [
  { 
    id: 1, 
    name: "Men's Casual T-Shirt", 
    price: 799, 
    image: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=600", 
    category: "Fashion", 
    description: "Soft, breathable cotton T-shirt for everyday comfort."
  },
  { 
    id: 2, 
    name: "Men's Sneakers", 
    price: 2199, 
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600", 
    category: "Fashion", 
    description: "Comfortable sneakers suitable for casual wear." 
  },
  { 
    id: 3, 
    name: "Laptop", 
    price: 45999, 
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600", 
    category: "Electronics", 
    description: "High-performance laptop for work and gaming." 
  },
  { 
    id: 4, 
    name: "Smartphone", 
    price: 25999, 
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600", 
    category: "Electronics", 
    description: "Latest smartphone with AMOLED display and 5G support." 
  },
  { 
    id: 5, 
    name: "Wireless Headphones", 
    price: 2599, 
    image: "https://images.pexels.com/photos/3394664/pexels-photo-3394664.jpeg?auto=compress&cs=tinysrgb&w=600", 
    category: "Electronics", 
    description: "Noise-cancelling wireless headphones with 20-hour battery." 
  },
  { 
    id: 6, 
    name: "Smartwatch", 
    price: 2999, 
    image: "https://images.pexels.com/photos/277406/pexels-photo-277406.jpeg?auto=compress&cs=tinysrgb&w=600", 
    category: "Electronics", 
    description: "Feature-packed smartwatch with fitness tracking and notifications." 
  }
];


let cart = [];
let reviews = {};
let currentRating = {};

const productList = document.getElementById("product-list");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");

function displayProducts(list) {
  productList.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="viewDetails(${p.id})">View Details</button>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}
displayProducts(products);

function filterCategory(cat) {
  if (cat === "All") displayProducts(products);
  else displayProducts(products.filter(p => p.category === cat));
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  cartCount.textContent = cart.length;
  updateCart();
  alert(`✅ ${item.name} added to cart.`); // Notify user
}

function toggleCart() {
  cartModal.style.display = cartModal.style.display === "block" ? "none" : "block";
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} – ₹${item.price}`;
    cartItems.appendChild(li);
  });
}

function viewDetails(id) {
  const p = products.find(prod => prod.id === id);
  const revs = reviews[id] || [];
  const detailsContent = document.getElementById("details-content");
  detailsContent.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.image}" style="width:100%;border-radius:10px;">
    <p>${p.description}</p>
    <p><b>Price:</b> ₹${p.price}</p>
    <button onclick="addToCart(${p.id})">Add to Cart</button>
    <div class="review-section">
      <h3>Reviews & Ratings</h3>
      <div class="stars" id="stars-${p.id}">
        ${[1,2,3,4,5].map(i=>`<span onclick="setRating(${p.id},${i})">★</span>`).join("")}
      </div>
      <textarea id="review-text-${p.id}" placeholder="Write a review..." rows="2"></textarea>
      <button onclick="addReview(${p.id})">Add Review</button>
      <div id="reviews-${p.id}">
        ${revs.map((r,i)=>`<div class="review">⭐${r.rating} – ${r.text} <button onclick="deleteReview(${p.id},${i})">❌</button></div>`).join("")}
      </div>
    </div>
  `;
  document.getElementById("details-modal").style.display = "block";
}

function closeDetails() {
  document.getElementById("details-modal").style.display = "none";
}

function openCheckout() {
  document.getElementById("checkout-modal").style.display = "block";
}

function closeCheckout() {
  document.getElementById("checkout-modal").style.display = "none";
}

function submitPayment() {
  if(cart.length === 0){
    alert("⚠️ Your cart is empty! Add products before checkout.");
    return;
  }

  const method = document.getElementById("payment-method").value;
  if (method === "Cash on Delivery") {
    alert("✅ Order placed! Please pay when the product is delivered.");
  } else {
    alert(`✅ Payment successful via ${method}!`);
  }
  cart = [];
  cartCount.textContent = 0;
  updateCart();
  closeCheckout();
}


function setRating(productId, rating) {
  currentRating[productId] = rating;
  const stars = document.querySelectorAll(`#stars-${productId} span`);
  stars.forEach((s, i) => s.classList.toggle("selected", i < rating));
}

function addReview(id) {
  const text = document.getElementById(`review-text-${id}`).value;
  const rating = currentRating[id] || 0;
  if (!text.trim()) return alert("Please write a review.");
  if (!rating) return alert("Please select a rating.");
  if (!reviews[id]) reviews[id] = [];
  reviews[id].push({text, rating});
  viewDetails(id);
}

function deleteReview(pid, index) {
  reviews[pid].splice(index, 1);
  viewDetails(pid);
}

function sortProducts() {
  const sortValue = document.getElementById("sort-price").value;
  let sortedProducts = [...products];
  if (sortValue === "low") sortedProducts.sort((a,b) => a.price - b.price);
  if (sortValue === "high") sortedProducts.sort((a,b) => b.price - a.price);
  displayProducts(sortedProducts);
}