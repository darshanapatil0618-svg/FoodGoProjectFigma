const foods = [
{id:1,name:"Classic Cheeseburger",category:"Burgers",price:199,rating:4.8,veg:false,tag:"Bestseller",desc:"Juicy grilled patty, cheese & house sauce.",img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"},
{id:2,name:"Margherita Pizza",category:"Pizza",price:249,rating:4.9,veg:true,tag:"Popular",desc:"Stone-baked pizza with basil & mozzarella.",img:"https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80"},
{id:3,name:"Paneer Tikka Bowl",category:"Indian Food",price:229,rating:4.7,veg:true,tag:"Chef's pick",desc:"Smoky paneer, rice and creamy mint chutney.",img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=700&q=80"},
{id:4,name:"Crispy Golden Fries",category:"Burgers",price:99,rating:4.6,veg:true,tag:"Snack time",desc:"Golden, crunchy fries with a tasty seasoning.",img:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"},
{id:5,name:"Veg Hakka Noodles",category:"Chinese",price:179,rating:4.6,veg:true,tag:"Wok tossed",desc:"Noodles tossed with crunchy fresh vegetables.",img:"https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80"},
{id:6,name:"Masala Dosa",category:"South Indian",price:149,rating:4.8,veg:true,tag:"Classic",desc:"Crispy dosa with potato masala and chutneys.",img:"https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80"},
{id:7,name:"Chocolate Lava Cake",category:"Desserts",price:129,rating:4.9,veg:true,tag:"Sweet treat",desc:"Warm chocolate cake with a molten center.",img:"https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=700&q=80"},
{id:8,name:"Mango Cooler",category:"Drinks",price:89,rating:4.5,veg:true,tag:"Refreshing",desc:"A chilled mango drink for sunny-day cravings.",img:"https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=700&q=80"},
{id:9,name:"Farmhouse Pizza",category:"Pizza",price:299,rating:4.8,veg:true,tag:"Loaded",desc:"Bell peppers, onions, olives and extra cheese.",img:"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"},
{id:10,name:"Spicy Chicken Burger",category:"Burgers",price:219,rating:4.7,veg:false,tag:"Spicy",desc:"Crispy chicken, fresh lettuce and spicy mayo.",img:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80"},
{id:11,name:"Butter Paneer",category:"Indian Food",price:259,rating:4.8,veg:true,tag:"Comfort food",desc:"Paneer in a rich tomato and butter gravy.",img:"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80"},
{id:12,name:"Chilli Garlic Momos",category:"Chinese",price:159,rating:4.6,veg:true,tag:"Street style",desc:"Steamed dumplings tossed in chilli garlic sauce.",img:"https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80"}
];
let cart = JSON.parse(sessionStorage.getItem("foodGoCart") || "[]");
let activeCategory = "All";
let showAllItems = false;
let latestOrder = null;
const $ = id => document.getElementById(id);
const rupee = n => "₹" + Number(n).toLocaleString("en-IN");
function saveCart(){sessionStorage.setItem("foodGoCart",JSON.stringify(cart));}
function showToast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),2300);}
function renderFoods(){
 const q=$("searchInput").value.trim().toLowerCase(), veg=$("vegOnly").checked;
 const filtered=foods.filter(f=>(activeCategory==="All"||f.category===activeCategory)&&(!veg||f.veg)&&(!q||(f.name+" "+f.category+" "+f.desc).toLowerCase().includes(q)));
 const list=showAllItems?filtered:filtered.slice(0,8);
 $("foodGrid").innerHTML=list.map(f=>`<article class="food-card"><div class="food-image-wrap"><img loading="lazy" src="${f.img}" alt="${f.name}"><span class="food-tag">${f.veg?'<span class="veg-dot"></span>Veg · ':''}${f.tag}</span></div><div class="food-card-content"><h3>${f.name}</h3><p class="food-description">${f.desc}</p><div class="food-meta"><span class="price">${rupee(f.price)}</span><span class="rating">★ ${f.rating}</span></div><button class="add-button" data-add="${f.id}">＋ Add to cart</button></div></article>`).join("");
 $("emptyMessage").classList.toggle("hidden",filtered.length!==0);
 $("showAll").classList.toggle("hidden",filtered.length<=8);
 $("showAll").textContent=showAllItems?"Show fewer dishes ↑":"Explore all dishes ↗";
}
function addToCart(id){const found=cart.find(i=>i.id===id);found?found.qty++:cart.push({id,qty:1});saveCart();renderCart();showToast("Added to your cart!");}
function cartTotals(){const subtotal=cart.reduce((s,i)=>s+foods.find(f=>f.id===i.id).price*i.qty,0);const fee=subtotal?30:0;return {subtotal,fee,total:subtotal+fee};}
function renderCart(){
 const count=cart.reduce((s,i)=>s+i.qty,0),t=cartTotals();
 $("cartCount").textContent=count;$("drawerCount").textContent=`(${count})`;
 $("cartItems").innerHTML=cart.length?cart.map(i=>{const f=foods.find(x=>x.id===i.id);return `<div class="cart-item"><img src="${f.img}" alt="${f.name}"><div><h4>${f.name}</h4><small>${rupee(f.price)} each</small><div class="quantity-control"><button data-qty="${f.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-qty="${f.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><div class="cart-item-right"><strong>${rupee(f.price*i.qty)}</strong><button class="remove-item" data-remove="${f.id}">Remove</button></div></div>`}).join(""):`<div class="empty-cart"><div style="font-size:42px">🛍️</div><h3>Your cart is hungry</h3><p>Add something delicious from our menu.</p><button class="btn btn-outline" id="emptyBrowse">Browse menu ↗</button></div>`;
 $("cartSubtotal").textContent=rupee(t.subtotal);$("deliveryFee").textContent=rupee(t.fee);$("cartTotal").textContent=rupee(t.total);
}
function openCart(){$("cartOverlay").classList.remove("hidden");document.body.style.overflow="hidden";}
function closeCart(){$("cartOverlay").classList.add("hidden");document.body.style.overflow="";}
function openPage(html){$("pageContent").innerHTML=html;$("pageOverlay").classList.remove("hidden");document.body.style.overflow="hidden";}
function closePage(){$("pageOverlay").classList.add("hidden");document.body.style.overflow="";}
function loginPage(register=false){openPage(`<span class="modal-eyebrow">WELCOME TO FOOD GO</span><h2 class="modal-title">${register?"Create your account":"Welcome back!"}</h2><p class="modal-subtitle">${register?"Sign up to make your next craving easier.":"Log in to continue to your delicious favorites."}</p><form class="auth-form" id="authForm">${register?'<label>Full name<input name="name" required placeholder="Your name"></label>':''}<label>Email address<input type="email" name="email" required placeholder="you@example.com"></label>${register?'<label>Phone number<input name="phone" required type="tel" pattern="[0-9+() -]{8,16}" placeholder="+91 98765 43210"></label>':''}<label>Password<div class="password-row"><input id="authPassword" type="password" name="password" required minlength="6" placeholder="At least 6 characters"><button class="show-password" type="button" id="togglePassword">Show</button></div></label>${register?'<label>Confirm password<input id="confirmPassword" type="password" required minlength="6" placeholder="Re-enter password"></label>':'<div class="forgot-row"><button class="inline-link" type="button" id="forgotPassword">Forgot password?</button></div>'}<button class="btn btn-primary" type="submit">${register?"Create account":"Login"} ↗</button></form><p class="auth-switch">${register?"Already have an account?":"New to Food Go?"} <button class="inline-link" id="switchAuth">${register?"Login":"Register"}</button></p><p class="auth-switch">Demo prototype: details are not sent to a server.</p>`);}
function checkoutPage(){
 if(!cart.length){closeCart();showToast("Your cart is empty.");return;}
 closeCart();const t=cartTotals();
 openPage(`<span class="modal-eyebrow">ALMOST THERE</span><h2 class="modal-title">Checkout</h2><p class="modal-subtitle">Add your delivery details to place your demo order.</p><form class="checkout-form" id="checkoutForm"><label>Customer name<input name="name" required placeholder="Full name"></label><label>Phone number<input name="phone" required type="tel" pattern="[0-9+() -]{8,16}" placeholder="+91 98765 43210"></label><label>Delivery address<textarea name="address" required rows="3" placeholder="House / flat, street, area, city, PIN code"></textarea></label><div class="checkout-items"><strong style="font-size:12px">Order summary</strong>${cart.map(i=>{let f=foods.find(x=>x.id===i.id);return `<div class="checkout-item-line"><span>${f.name} × ${i.qty}</span><strong>${rupee(f.price*i.qty)}</strong></div>`}).join("")}<div class="checkout-item-line muted"><span>Subtotal</span><span>${rupee(t.subtotal)}</span></div><div class="checkout-item-line muted"><span>Delivery fee</span><span>${rupee(t.fee)}</span></div><div class="checkout-item-line"><strong>Total</strong><strong>${rupee(t.total)}</strong></div></div><strong style="font-size:12px">Payment method</strong><div class="payment-options"><label><input type="radio" name="payment" value="Cash on Delivery" checked> Cash on Delivery</label><label><input type="radio" name="payment" value="Online Payment"> Online payment</label></div><button class="btn btn-primary" type="submit">Place order · ${rupee(t.total)} ↗</button><p class="auth-switch">Demo only — no real payment is processed.</p></form>`);
}
function confirmationPage(){
 const o=latestOrder;if(!o)return trackingPage();
 openPage(`<div class="success-view"><div class="success-icon">✓</div><span class="modal-eyebrow">ORDER SUCCESSFULLY PLACED</span><h2 class="modal-title">You’re in for a treat!</h2><p class="modal-subtitle">Thanks, ${escapeHtml(o.name)}. Your delicious order is on its way.</p><div class="order-id">YOUR ORDER ID<strong>${o.id}</strong></div><div class="success-summary"><p><strong>Items</strong></p>${o.items.map(i=>`<p>${escapeHtml(i.name)} × ${i.qty} <span style="float:right;color:white">${rupee(i.price*i.qty)}</span></p>`).join("")}<p><strong>Total paid on delivery / selected method <span style="float:right">${rupee(o.total)}</span></strong></p><p><strong>Delivery to:</strong> ${escapeHtml(o.address)}</p><p><strong>Payment:</strong> ${escapeHtml(o.payment)}</p><p><strong>Estimated delivery:</strong> ${o.eta}</p></div><button class="btn btn-primary full-width" id="trackOrderButton">Track your order ↗</button><button class="btn btn-outline full-width" id="continueShopping">Continue shopping</button></div>`);
}
function trackingPage(){
 const o=latestOrder;
 if(!o){openPage(`<span class="modal-eyebrow">ORDER TRACKING</span><h2 class="modal-title">Track your order</h2><p class="modal-subtitle">Place a demo order first and your order tracking will appear here.</p><button class="btn btn-primary" id="trackingBrowse">Browse menu ↗</button>`);return;}
 const stages=[["Order Placed","We’ve received your order."],["Order Confirmed","The restaurant confirmed your order."],["Preparing Food","Your meal is being prepared fresh."],["Out for Delivery","Your delivery partner is on the way."],["Delivered","Enjoy your delicious meal!"]];
 openPage(`<span class="modal-eyebrow">YOUR FOOD JOURNEY</span><h2 class="modal-title">Track your order</h2><p class="modal-subtitle">Follow your order from kitchen to doorstep.</p><div class="tracking-head"><div><small>ORDER ID</small><strong>${o.id}</strong></div><div><small>ESTIMATED ARRIVAL</small><strong>${o.eta}</strong></div></div><div class="tracking-timeline">${stages.map((s,i)=>`<div class="tracking-step ${i===0?"done":""}"><span class="tracking-dot">${i===0?"✓":i+1}</span><div><h4>${s[0]}</h4><p>${i===0?new Date(o.created).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):s[1]}</p></div></div>`).join("")}</div><div class="success-summary"><strong style="font-size:12px">Order summary · ${rupee(o.total)}</strong>${o.items.map(i=>`<p>${escapeHtml(i.name)} × ${i.qty}</p>`).join("")}<p><strong>Delivery address:</strong> ${escapeHtml(o.address)}</p></div><p class="auth-switch">Prototype timeline: only “Order Placed” is marked complete.</p><button class="btn btn-outline full-width" id="continueShopping">Back to menu ↗</button>`);
}
function escapeHtml(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){addToCart(Number(add.dataset.add));return;}
 const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(i=>i.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(i=>i.id!==item.id);saveCart();renderCart();}return;}
 const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(i=>i.id!==Number(rem.dataset.remove));saveCart();renderCart();showToast("Item removed.");return;}
 const cat=e.target.closest("[data-category]");if(cat){activeCategory=cat.dataset.category;document.querySelectorAll(".category-chip").forEach(c=>c.classList.toggle("selected",c===cat));showAllItems=true;renderFoods();if(!cat.closest("#categoryList"))return;if(cat.dataset.category!=="All")document.querySelector("#menu").scrollIntoView({behavior:"smooth"});return;}
 const page=e.target.closest("[data-page]");if(page){page.dataset.page==="login"?loginPage():trackingPage();return;}
 if(e.target.closest("#cartOpen"))openCart();
 if(e.target.closest("#cartClose")||e.target.id==="cartOverlay")closeCart();
 if(e.target.closest("#pageClose")||e.target.id==="pageOverlay")closePage();
 if(e.target.closest("#checkoutButton"))checkoutPage();
 if(e.target.closest("#showAll")){showAllItems=!showAllItems;renderFoods();}
 if(e.target.closest("#emptyBrowse")){closeCart();document.querySelector("#menu").scrollIntoView({behavior:"smooth"});}
 if(e.target.closest("#switchAuth"))loginPage($("pageContent").querySelector("#confirmPassword")!==null);
 if(e.target.closest("#togglePassword")){const p=$("authPassword");p.type=p.type==="password"?"text":"password";e.target.textContent=p.type==="password"?"Show":"Hide";}
 if(e.target.closest("#forgotPassword"))showToast("Password reset is a demo feature.");
 if(e.target.closest("#trackOrderButton"))trackingPage();
 if(e.target.closest("#continueShopping")||e.target.closest("#trackingBrowse")){closePage();document.querySelector("#menu").scrollIntoView({behavior:"smooth"});}
});
$("searchInput").addEventListener("input",()=>{showAllItems=true;renderFoods();});
$("vegOnly").addEventListener("change",()=>{showAllItems=true;renderFoods();});
$("mobileMenu").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
$("mainNav").addEventListener("click",e=>{if(e.target.tagName==="A")$("mainNav").classList.remove("open");});
$("contactForm").addEventListener("submit",e=>{e.preventDefault();$("contactMessage").textContent="Thanks! Your message has been recorded in this demo.";e.target.reset();});
document.addEventListener("submit",e=>{
 if(e.target.id==="authForm"){e.preventDefault();const fd=new FormData(e.target);const pass=fd.get("password");if(e.target.querySelector("#confirmPassword")&&pass!==fd.get("confirmPassword")){showToast("Passwords do not match.");return;}showToast(e.target.querySelector("#confirmPassword")?"Demo account created!":"Demo login successful!");closePage();}
 if(e.target.id==="checkoutForm"){e.preventDefault();const fd=new FormData(e.target),t=cartTotals();latestOrder={id:"FG-"+Math.random().toString(36).slice(2,8).toUpperCase(),name:fd.get("name"),phone:fd.get("phone"),address:fd.get("address"),payment:fd.get("payment"),items:cart.map(i=>({...foods.find(f=>f.id===i.id),qty:i.qty})),total:t.total,eta:"25–40 minutes",created:new Date().toISOString()};cart=[];saveCart();renderCart();confirmationPage();}
});
$("year").textContent=new Date().getFullYear();
renderFoods();renderCart();