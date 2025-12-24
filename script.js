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
  const product = window.ALL_PRODUCTS.find(
    p => p.id.toLowerCase() === id.toLowerCase()
  );
  if (!product) {
    alert("Không tìm thấy sản phẩm");
    return;
  }

  const cart = getCart();
  const found = cart.find(
    p => p.id.toLowerCase() === id.toLowerCase()
  );

  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });

  saveCart(cart);
  window.location.href = "cart.html";
}

/**********************
 * LOAD PRODUCT LIST
 **********************/
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products");
  window.ALL_PRODUCTS = [];

  fetch(CSV_URL)
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").slice(1);
      if (container) container.innerHTML = "";

      rows.forEach(row => {
        // split CSV an toàn (có dấu , trong text)
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        const product = {
          id: cols[0]?.trim(),
          name: cols[1]?.replace(/"/g, "").trim(),
          price: Number(cols[2]) || 0,
          image: cols[3]?.replace(/"/g, "").trim() || NO_IMAGE,
          desc: cols[4]?.replace(/"/g, "").trim() || ""
        };

        // chỉ bỏ qua khi thiếu ID hoặc tên
        if (!product.id || !product.name) return;

        window.ALL_PRODUCTS.push(product);

        if (container) {
          container.innerHTML += `
            <div class="product">
              <a href="product.html?id=${encodeURIComponent(product.id)}">
                <img src="${product.image}" alt="${product.name}">
              </a>

              <h3>
                <a href="product.html?id=${encodeURIComponent(product.id)}">
                  ${product.name}
                </a>
              </h3>

              <div class="price">
                ${product.price.toLocaleString("vi-VN")} ₫
              </div>

              <button class="buy-btn"
                onclick="addToCartById('${product.id}')">
                Thêm vào giỏ
              </button>
            </div>
          `;
        }
      });

      console.log("ĐÃ LOAD", window.ALL_PRODUCTS.length, "SẢN PHẨM");
    })
    .catch(err => {
      console.error(err);
      if (container) container.innerHTML = "<p>Lỗi tải sản phẩm</p>";
    });
});

/**********************
 * PRODUCT DETAIL PAGE
 **********************/
document.addEventListener("DOMContentLoaded", () => {
  const detailBox = document.getElementById("productDetail");
  if (!detailBox) return;

  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    detailBox.innerHTML = "<p>Thiếu ID sản phẩm</p>";
    return;
  }

  fetch(CSV_URL)
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").slice(1);
      let product = null;

      rows.forEach(row => {
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (
          cols[0] &&
          cols[0].trim().toLowerCase() === id.toLowerCase()
        ) {
          product = {
            id: cols[0].trim(),
            name: cols[1]?.replace(/"/g, "").trim(),
            price: Number(cols[2]) || 0,
            image: cols[3]?.replace(/"/g, "").trim() || NO_IMAGE,
            desc: cols[4]?.replace(/"/g, "").trim() || ""
          };
        }
      });

      if (!product) {
        detailBox.innerHTML = "<p>❌ Không tìm thấy sản phẩm</p>";
        return;
      }

      detailBox.innerHTML = `
        <div class="product-detail">
          <img src="${product.image}">
          <h2>${product.name}</h2>
          <div class="price">
            ${product.price.toLocaleString("vi-VN")} ₫
          </div>
          <p>${product.desc || "Đang cập nhật mô tả..."}</p>
          <button onclick="addToCartById('${product.id}')">
            Thêm vào giỏ
          </button>
        </div>
      `;
    })
    .catch(err => {
      console.error(err);
      detailBox.innerHTML = "<p>Lỗi tải dữ liệu</p>";
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
                                 
