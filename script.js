/**********************
 * CONFIG
 **********************/
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

/**********************
 * CART FUNCTIONS
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

  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  window.location.href = "cart.html";
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

/**********************
 * LOAD PRODUCTS
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
        // Tách CSV an toàn (có dấu , trong text)
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        const product = {
          id: cols[0]?.trim(),
          name: cols[1]?.trim(),
          price: Number(cols[2]),
          image: cols[3]?.replace(/"/g, "").trim()
        };

        if (!product.id || !product.name || !product.price || !product.image) return;

        window.ALL_PRODUCTS.push(product);

        container.innerHTML += `
          <div class="product">
            <img src="${encodeURI(product.image)}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">
              ${product.price.toLocaleString("vi-VN")} ₫
            </div>
            <button class="buy-btn" onclick="addToCartById('${product.id}')">
              Thêm vào giỏ
            </button>
          </div>
        `;
      });
    })
    .catch(() => {
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
      <div class="cart-item">
        <b>${p.name}</b><br>
        ${p.price.toLocaleString("vi-VN")} ₫ × ${p.qty}<br>
        <button onclick="changeQty(${i}, -1)">−</button>
        <button onclick="changeQty(${i}, 1)">+</button>
        <button onclick="removeItem(${i})">Xóa</button>
      </div>
    `;
  });

  totalBox.innerText = total.toLocaleString("vi-VN") + " ₫";
}

// Tự render nếu đang ở trang cart
document.addEventListener("DOMContentLoaded", renderCart);
                          
