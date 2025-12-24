/**********************
 * CONFIG
 **********************/
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

const NO_IMAGE =
  "https://via.placeholder.com/300x300?text=No+Image";

window.ALL_PRODUCTS = [];

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
  const product = window.ALL_PRODUCTS.find(
    p => p.id.toLowerCase() === id.toLowerCase()
  );
  if (!product) return alert("Không tìm thấy sản phẩm");

  const cart = getCart();
  const found = cart.find(p => p.id === product.id);

  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });

  saveCart(cart);
  location.href = "cart.html";
}

/**********************
 * LOAD PRODUCT LIST
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

      rows.forEach(row => {
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        const product = {
          id: cols[0]?.trim(),
          name: cols[1]?.replace(/"/g, "").trim(),
          price: Number(cols[2]) || 0,
          image: cols[3]?.replace(/"/g, "").trim() || NO_IMAGE,
          desc: cols[4]?.replace(/"/g, "").trim() || ""
        };

        if (!product.id || !product.name) return;

        window.ALL_PRODUCTS.push(product);

        container.innerHTML += `
          <div class="product">
            <a href="product.html?id=${encodeURIComponent(product.id)}">
              <img src="${product.image}" alt="${product.name}">
              <h3>${product.name}</h3>
            </a>
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

      console.log("Đã load", window.ALL_PRODUCTS.length, "sản phẩm");
    });
});

/**********************
 * PRODUCT DETAIL PAGE
 **********************/
document.addEventListener("DOMContentLoaded", () => {
  const detailBox = document.getElementById("productDetail");
  if (!detailBox) return;

  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  fetch(CSV_URL)
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").slice(1);
      let p = null;

      rows.forEach(row => {
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (cols[0]?.trim().toLowerCase() === id.toLowerCase()) {
          p = {
            id: cols[0].trim(),
            name: cols[1]?.replace(/"/g, "").trim(),
            price: Number(cols[2]) || 0,
            image: cols[3]?.replace(/"/g, "").trim() || NO_IMAGE,
            desc: cols[4]?.replace(/"/g, "").trim() || ""
          };
        }
      });

      if (!p) {
        detailBox.innerHTML = "<p>Không tìm thấy sản phẩm</p>";
        return;
      }

      detailBox.innerHTML = `
        <div class="product-detail">
          <img src="${p.image}">
          <h2>${p.name}</h2>
          <div class="price">
            ${p.price.toLocaleString("vi-VN")} ₫
          </div>
          <p>${p.desc || "Đang cập nhật mô tả..."}</p>
          <button onclick="addToCartById('${p.id}')">
            Thêm vào giỏ
          </button>
        </div>
      `;
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
