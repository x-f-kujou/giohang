/**********************
 * CONFIG
 **********************/
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

const NO_IMAGE = "https://via.placeholder.com/400x400?text=No+Image";

/**********************
 * CART
 **********************/
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

/**********************
 * TOAST
 **********************/
function showToast(text) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";

    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "30px";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#323232";
    toast.style.color = "#fff";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "14px";
    toast.style.zIndex = "999999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity .3s ease, bottom .3s ease";

    document.body.appendChild(toast);
  }

  toast.innerText = text;
  toast.style.opacity = "1";
  toast.style.bottom = "50px";

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.bottom = "30px";
  }, 2000);
}

/**********************
 * ADD TO CART
 **********************/
function addToCart(product) {
  const cart = getCart();
  const found = cart.find(p => p.id === product.id);

  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });

  saveCart(cart);
  showToast("✅ Đã thêm vào giỏ hàng");
}

/**********************
 * LOAD PRODUCT LIST
 **********************/
function loadProducts() {
  const box = document.getElementById("products");
  if (!box) return;

  fetch(CSV_URL)
    .then(r => r.text())
    .then(t => {
      const rows = t.trim().split("\n").slice(1);
      box.innerHTML = "";

      rows.forEach(row => {
        const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (!c[0] || !c[1]) return;

        const p = {
          id: c[0].trim(),
          name: c[1].replace(/"/g, ""),
          price: Number(c[2]) || 0,
          image: c[3]?.replace(/"/g, "") || NO_IMAGE,
          desc: c[4]?.replace(/"/g, "") || ""
        };

        box.innerHTML += `
          <div class="product">
            <a href="product.html?id=${encodeURIComponent(p.id)}">
              <img src="${p.image}">
              <h3>${p.name}</h3>
            </a>
            <div class="price">
              ${p.price.toLocaleString("vi-VN")} ₫
            </div>
            <button onclick="addToCartById('${p.id}')">
          
              Thêm vào giỏ
            </button>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error(err);
      box.innerHTML = "<p>Lỗi tải sản phẩm</p>";
    });
}

/**********************
 * PRODUCT DETAIL
 **********************/
function loadProductDetail() {
  const box = document.getElementById("product-detail");
  if (!box) return;

  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    box.innerHTML = "<p>❌ Thiếu ID sản phẩm</p>";
    return;
  }

  fetch(CSV_URL)
    .then(r => r.text())
    .then(t => {
      const rows = t.trim().split("\n").slice(1);
      let product = null;

      rows.forEach(row => {
        const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (c[0] && c[0].trim().toLowerCase() === id.toLowerCase()) {
          product = {
            id: c[0].trim(),
            name: c[1]?.replace(/"/g, ""),
            price: Number(c[2]) || 0,
            image: c[3]?.replace(/"/g, "") || NO_IMAGE,
            desc: c[4]?.replace(/"/g, "") || ""
          };
        }
      });

      if (!product) {
        box.innerHTML = "<p>❌ Không tìm thấy sản phẩm</p>";
        return;
      }

      box.innerHTML = `
        <div class="product-detail">
          <img src="${product.image}">
          <h2>${product.name}</h2>
          <div class="price">
            ${product.price.toLocaleString("vi-VN")} ₫
          </div>
          <p>${product.desc || "Đang cập nhật mô tả..."}</p>
          <button onclick='addToCart(${JSON.stringify(product)})'>
            Thêm vào giỏ hàng
          </button>
        </div>
      `;
    })
    .catch(err => {
      console.error(err);
      box.innerHTML = "<p>Lỗi tải dữ liệu</p>";
    });
}

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
        <button onclick="removeItem(${i})">❌ Xóa</button>
      </div>
    `;
  });

  totalBox.innerText = total.toLocaleString("vi-VN") + " ₫";
}

/**********************
 * INIT
 **********************/
document.addEventListener("DOMContentLoaded", () => {
  updateBadge();
  loadProducts();
  loadProductDetail();
  renderCart();
});
          
