/**********************
 * CONFIG
 **********************/
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

const NO_IMAGE = "https://via.placeholder.com/300";

/**********************
 * CART
 **********************/
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCartById(id) {
  const product = window.ALL_PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const cart = getCart();
  const found = cart.find(p => p.id === id);

  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });

  saveCart(cart);
  location.href = "cart.html";
}

/**********************
 * LOAD PRODUCTS (SAFE MODE)
 **********************/
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products");
  if (!container) return;

  fetch(CSV_URL)
    .then(r => r.text())
    .then(text => {
      const lines = text.split("\n");
      window.ALL_PRODUCTS = [];
      container.innerHTML = "";

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");

        if (cols.length < 2) continue;

        const id = cols[0]?.trim() || `sp-${i}`;
        const name = cols[1]?.trim();
        const price = Number((cols[2] || "0").replace(/[^\d]/g, ""));
        const image = cols[3]?.trim() || NO_IMAGE;

        if (!name) continue;

        const product = { id, name, price, image };
        window.ALL_PRODUCTS.push(product);

        container.innerHTML += `
          <div class="product">
            <img src="${image}" alt="${name}">
            <h3>${name}</h3>
            <div class="price">
              ${price.toLocaleString("vi-VN")} ₫
            </div>
            <button class="buy-btn"
              onclick="addToCartById('${id}')">
              Thêm vào giỏ
            </button>
          </div>
        `;
      }

      console.log("SỐ SP LOAD:", window.ALL_PRODUCTS.length);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Lỗi tải sản phẩm</p>";
    });
});

/**********************
 * CART PAGE
 **********************/
function renderCart() {
  const cart = getCart();
  const box = document.getElementById("cart");
  const totalBox = document.getElementById("total");
  if (!box || !totalBox) return;

  box.innerHTML = "";
  let total = 0;

  cart.forEach((p, i) => {
    total += p.price * p.qty;
    box.innerHTML += `
      <div>
        <b>${p.name}</b><br>
        ${p.price.toLocaleString("vi-VN")} ₫ × ${p.qty}<br>
        <button onclick="changeQty(${i},-1)">−</button>
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="removeItem(${i})">Xóa</button>
      </div><hr>
    `;
  });

  totalBox.innerText = total.toLocaleString("vi-VN") + " ₫";
}

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

document.addEventListener("DOMContentLoaded", renderCart);
    
