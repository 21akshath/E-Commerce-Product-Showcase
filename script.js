// Products (15 sample with real images)
const products = [
  { id:1, name:"Smartphone", category:"Electronics", price:19999, img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", reviews:["Great phone!"], ratings:[5] },
  { id:2, name:"Laptop", category:"Electronics", price:55999, img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8", reviews:["Perfect for coding"], ratings:[5] },
  { id:3, name:"Headphones", category:"Electronics", price:2999, img:"https://images.unsplash.com/photo-1511367461989-f85a21fda167", reviews:["Amazing sound"], ratings:[4] },
  { id:4, name:"Jacket", category:"Fashion", price:3499, img:"https://images.unsplash.com/photo-1520975698519-59cdbd6d6b3c", reviews:["Warm and stylish"], ratings:[4] },
  { id:5, name:"Sneakers", category:"Fashion", price:2499, img:"https://images.unsplash.com/photo-1542293787938-c9e299b880ca", reviews:["Comfortable"], ratings:[5] },
  { id:6, name:"Handbag", category:"Fashion", price:1899, img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3", reviews:["Classy bag"], ratings:[5] },
  { id:7, name:"Sofa", category:"Home", price:15999, img:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7", reviews:["Very comfy"], ratings:[4,5] },
  { id:8, name:"Dining Table", category:"Home", price:10999, img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c", reviews:["Perfect for family"], ratings:[5] },
  { id:9, name:"Lipstick", category:"Beauty", price:499, img:"https://images.unsplash.com/photo-1583337130417-3346a1af22f1", reviews:["Lovely shade"], ratings:[4] },
  { id:10, name:"Perfume", category:"Beauty", price:1299, img:"https://images.unsplash.com/photo-1508973376-2a3b6e4d9c5c", reviews:["Fragrance lasts long"], ratings:[5] },
  { id:11, name:"Tablet", category:"Electronics", price:12999, img:"https://images.unsplash.com/photo-1555617117-08cfc0b2e5c0", reviews:["Nice tablet"], ratings:[4] },
  { id:12, name:"Watch", category:"Fashion", price:3999, img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30", reviews:["Elegant watch"], ratings:[4] },
  { id:13, name:"Coffee Maker", category:"Home", price:4999, img:"https://images.unsplash.com/photo-1511920170033-f8396924c348", reviews:["Brews fast"], ratings:[5] },
  { id:14, name:"Sunglasses", category:"Fashion", price:1499, img:"https://images.unsplash.com/photo-1520975698519-59cdbd6d6b3c", reviews:["Stylish"], ratings:[5] },
  { id:15, name:"Bluetooth Speaker", category:"Electronics", price:2999, img:"https://images.unsplash.com/photo-1517059224940-d4af9eec41e7", reviews:["Great sound"], ratings:[4] }
];let cart = [];
let currentProductId = null;

// Display Products
function displayProducts(list=products){
  const container = document.getElementById("productList");
  container.innerHTML="";
  list.forEach(p=>{
    container.innerHTML+=`
      <div class="product">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.category}</p>
        <p>₹${p.price}</p>
        <button onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
        <button onclick="viewDetails(${p.id})">View Details</button>
      </div>`;
  });
}
displayProducts();

// Cart Functions
function addToCart(name,price){
  const item = cart.find(i=>i.name===name);
  if(item) item.qty++;
  else cart.push({name,price,qty:1});
  updateCartCount();
}
function updateCartCount(){
  document.getElementById("cartCount").textContent=cart.reduce((sum,i)=>sum+i.qty,0);
}
document.getElementById("cartBtn").onclick=()=>{
  document.getElementById("cartModal").style.display="flex";
  renderCart();
};
function renderCart(){
  const cartItems=document.getElementById("cartItems");
  cartItems.innerHTML="";
  let total=0;
  cart.forEach((item,i)=>{
    total+=item.price*item.qty;
    cartItems.innerHTML+=`<div>${item.name} - ₹${item.price} x ${item.qty} 
      <button onclick="changeQty(${i},1)">➕</button>
      <button onclick="changeQty(${i},-1)">➖</button>
      <button onclick="removeItem(${i})">❌</button>
    </div>`;
  });
  document.getElementById("cartTotal").textContent="Total: ₹"+total;
}
function changeQty(i,delta){ cart[i].qty+=delta; if(cart[i].qty<=0) cart.splice(i,1); renderCart(); updateCartCount(); }
function removeItem(i){ cart.splice(i,1); renderCart(); updateCartCount(); }
function checkout(){
  if(cart.length===0){ alert("Cart is empty!"); return; }
  alert("✅ Order Confirmed! Total: ₹"+cart.reduce((sum,i)=>sum+i.price*i.qty,0));
  cart=[]; renderCart(); updateCartCount();
}
function closeCart(){ document.getElementById("cartModal").style.display="none"; }

// Product Details
function viewDetails(id){
  const p = products.find(pr=>pr.id===id);
  currentProductId=id;
  document.getElementById("modalImg").src=p.img;
  document.getElementById("modalName").textContent=p.name;
  document.getElementById("modalCategory").textContent="Category: "+p.category;
  document.getElementById("modalPrice").textContent="Price: ₹"+p.price;
  document.getElementById("modalDesc").textContent="This is a premium "+p.name+".";
  renderReviews(p);
  document.getElementById("modalAddCart").onclick=()=>addToCart(p.name,p.price);
  document.getElementById("productModal").style.display="flex";
}
function closeModal(){ document.getElementById("productModal").style.display="none"; }

// Reviews
function renderReviews(product){
  let avg = product.ratings.length ? (product.ratings.reduce((a,b)=>a+b,0)/product.ratings.length).toFixed(1) : 0;
  let stars = "⭐".repeat(Math.round(avg)) + "☆".repeat(5-Math.round(avg));
  document.getElementById("avgRating").innerHTML=`<h4>${stars} (${avg})</h4>`;
  let reviewsHTML="<h4>Customer Reviews:</h4>";
  if(product.reviews.length===0) reviewsHTML+="<p>No reviews yet.</p>";
  else { reviewsHTML+="<ul>"; product.reviews.forEach((r,i)=>{ reviewsHTML+=`<li>⭐ ${product.ratings[i]} - ${r}</li>`; }); reviewsHTML+="</ul>"; }
  document.getElementById("reviews").innerHTML=reviewsHTML;
}
function addReview(){
  const input=document.getElementById("reviewInput");
  const ratingSelect=document.getElementById("ratingInput");
  const newReview=input.value.trim();
  const newRating=parseInt(ratingSelect.value);
  if(newReview==="") return;
  const product=products.find(p=>p.id===currentProductId);
  product.reviews.push(newReview); product.ratings.push(newRating);
  renderReviews(product);
  input.value="";
}

// Search, Sort, Dark Mode
function searchProducts(){ 
  const q=document.getElementById("searchBox").value.toLowerCase();
  displayProducts(products.filter(p=>p.name.toLowerCase().includes(q)));
}
function clearSearch(){ document.getElementById("searchBox").value=""; displayProducts(); }
function sortProducts(){
  const val=document.getElementById("sortSelect").value;
  let sorted=[...products];
  if(val==="low") sorted.sort((a,b)=>a.price-b.price);
  else if(val==="high") sorted.sort((a,b)=>b.price-a.price);
  else if(val==="az") sorted.sort((a,b)=>a.name.localeCompare(b.name));
  displayProducts(sorted);
}
function toggleDarkMode(){ document.body.classList.toggle("dark-mode"); }