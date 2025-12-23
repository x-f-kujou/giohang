/**********************
 * CONFIG
 **********************/
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

const NO_IMAGE =
  "https://via.placeholder.com/300x300?text=No+Image";

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
  window.location.href = "cart.html";
}

/**********************
 * LOAD PRODUCTS (FIX CSV)
 **********************/
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products");
  if (!container) return;

  fetch(CSV_URL)
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").slice(1);
      container.innerHTML = "";
      window.ALL_PRODUCTS = [];

      rows.forEach((row, index) => {
        // Tách CSV an toàn (có dấu , trong tên)
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        const id = cols[0]?.trim();
        const name = cols[1]?.replace(/"/g, "").trim();
        const price = Number(cols[2]);
        const image = cols[3]
          ? cols[3].replace(/"/g, "").trim()
          : NO_IMAGE;

        // 👉 CHỈ BỎ QUA KHI THIẾU ID HOẶC TÊN
        if (!id || !name) {
          console.warn("Bỏ dòng lỗi:", index + 2, cols);
          return;
        }

        const product = {
          id,
          name,
          price: isNaN(price) ? 0 : price,
          image: image || NO_IMAGE
        };

        window.ALL_PRODUCTS.push(product);

        container.innerHTML += `
          <div class="product">
            <img src="${encodeURI(product.image)}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">
              ${product.price.toLocaleString("vi-VN")} ₫
            </div>
            <button class="buy-btn"
              onclick="addToCartById('${product.id}')">
              Thêm vào giỏ
            </button>
          </div>
        `;
      });

      console.log("TỔNG SẢN PHẨM LOAD:", window.ALL_PRODUCTS.length);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Lỗi tải sản phẩm</p>";
    });
});

/**********************
 * CART PAGE
 **********************/
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
  const cart = getCart();
  const box = document.getElementById("cart");
  const totalBox = document.getElementById("total");

  if (!box || !totalBox) return;

  box.innerHTML = "";
  let total = 0;

  cart.forEach((p, i) => {
    total += p.price * p.qty;
    box.innerHTML += `
      <div class="cart-item">
        <b>${p.name}</b><br>
        ${p.price.toLocaleString("vi-VN")} ₫ × ${p.qty}<br>
        <button onclick="changeQty(${i},-1)">−</button>
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="removeItem(${i})">Xóa</button>
      </div>
    `;
  });

  totalBox.innerText = total.toLocaleString("vi-VN") + " ₫";
}

document.addEventListener("DOMContentLoaded", renderCart);
