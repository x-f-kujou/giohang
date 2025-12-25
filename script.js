const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

const NO_IMAGE = "https://via.placeholder.com/300";

/* ================= GLOBAL ================= */
window.ALL_PRODUCTS = [];

/* ================= CART ================= */
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBadge();
}

function updateBadge() {
  const cart = getCart();
  const count = cart.reduce((s, p) => s + p.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.innerText = count;
}

/* ================= TOAST ================= */
function showToast(text) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText = `
      position:fixed;bottom:20px;left:50%;
      transform:translateX(-50%);
      background:#333;color:#fff;
      padding:10px 16px;border-radius:6px;
      z-index:9999;font-size:14px;
    `;
    document.body.appendChild(t);
  }
  t.innerText = text;
  t.style.display = "block";
  setTimeout(() => t.style.display = "none", 2000);
}

/* ================= ADD CART (FIX) ================= */
function addToCartById(id) {
  const product = window.ALL_PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const cart = getCart();
  const found = cart.find(p => p.id === id);
  if (found) found.qty++;
  else cart.push({ ...product, qty: 1 });

  saveCart(cart);
  showToast("✅ Đã thêm vào giỏ hàng");
}

/* ================= LOAD PRODUCTS ================= */
document.addEventListener("DOMContentLoaded", () => {
  updateBadge();
  loadProducts();
  renderCart();
  loadProductDetail();
});

function loadProducts() {
  const box = document.getElementById("products");
  if (!box) return;

  fetch(CSV_URL)
    .then(r => r.text())
    .then(t => {
      const rows = t.trim().split("\n").slice(1);
      box.innerHTML = "";
      window.ALL_PRODUCTS = [];

      rows.forEach(r => {
        const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (!c[0] || !c[1]) return;

        const p = {
          id: c[0].trim(),
          name: c[1].replace(/"/g, "").trim(),
          price: Number(c[2]) || 0,
          image: c[3]?.replace(/"/g, "").trim() || NO_IMAGE,
          desc: c[4]?.replace(/"/g, "").trim() || ""
        };

        window.ALL_PRODUCTS.push(p);

        box.innerHTML += `
          <div class="product">
            <a href="product.html?id=${p.id}">
              <img src="${p.image}">
              <h3>${p.name}</h3>
            </a>
            <div class="price">${p.price.toLocaleString("vi-VN")} ₫</div>
            <button onclick="addToCartById('${p.id}')">
              Thêm vào giỏ
            </button>
          </div>
        `;
      });
    });
}

/* ================= PRODUCT DETAIL ================= */
function loadProductDetail() {
  const box = document.getElementById("product-detail");
  if (!box) return;

  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  fetch(CSV_URL)
    .then(r => r.text())
    .then(t => {
      const rows = t.trim().split("\n").slice(1);
      rows.forEach(r => {
        const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (c[0]?.trim() !== id) return;

        const p = {
          id,
          name: c[1].replace(/"/g, ""),
          price: Number(c[2]) || 0,
          image: c[3]?.replace(/"/g, "") || NO_IMAGE,
          desc: c[4]?.replace(/"/g, "") || ""
        };

        box.innerHTML = `
          <img src="${p.image}" style="max-width:100%">
          <h2>${p.name}</h2>
          <div class="price">${p.price.toLocaleString("vi-VN")} ₫</div>
          <p>${p.desc}</p>
          <button onclick="addToCartById('${p.id}')">
            🛒 Thêm vào giỏ
          </button>
        `;
      });
    });
}

/* ================= CART PAGE ================= */
function changeQty(i, d) {
  const cart = getCart();
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart(cart);
  renderCart();
}

function removeItem(i) {
  const cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const box = document.getElementById("cart");
  const totalBox = document.getElementById("total");
  if (!box || !totalBox) return;

  let total = 0;
  box.innerHTML = "";

  getCart().forEach((p, i) => {
    total += p.price * p.qty;
    box.innerHTML += `
      <div class="cart-item">
        <b>${p.name}</b><br>
        ${p.price.toLocaleString("vi-VN")} ₫ × ${p.qty}<br>
        <button onclick="changeQty(${i},-1)">−</button>
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="removeItem(${i})">❌</button>
      </div>
    `;
  });

  totalBox.innerText = total.toLocaleString("vi-VN") + " ₫";
          }
                   
