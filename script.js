const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

/* ========= CART ========= */
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const found = cart.find(p => p.id === product.id);

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

/* ========= LOAD PRODUCTS ========= */
fetch(CSV_URL)
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split("\n").slice(1);
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";

    rows.forEach(row => {
      const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      const product = {
        id: cols[0],
        name: cols[1],
        price: Number(cols[2]),
        image: cols[3]?.replace(/"/g, "")
      };

      if (!product.name || !product.price || !product.image) return;

      container.innerHTML += `
        <div class="product">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <div class="price">${product.price.toLocaleString("vi-VN")} ₫</div>
          <button onclick='addToCart(${JSON.stringify(product)})'>
            Thêm vào giỏ
          </button>
        </div>
      `;
    });
  })
  .catch(() => {
    document.getElementById("products").innerHTML =
      "<p>Lỗi tải sản phẩm</p>";
  });

/* ========= CART PAGE ========= */
function renderCart() {
  const cart = getCart();
  const box = document.getElementById("cart");
  const totalBox = document.getElementById("total");

  if (!box) return;

  box.innerHTML = "";
  let total = 0;

  cart.forEach((p, i) => {
    total += p.price * p.qty;
    box.innerHTML += `
      <div class="cart-item">
        <b>${p.name}</b><br>
        ${p.price.toLocaleString("vi-VN")} ₫ x ${p.qty}<br>
        <button onclick="changeQty(${i},-1)">−</button>
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="removeItem(${i})">Xóa</button>
      </div>
    `;
  });

  totalBox.innerText = total.toLocaleString("vi-VN") + " ₫";
}
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

renderCart();
    if (!container) return;

    container.innerHTML = "";
    window.ALL_PRODUCTS = [];

    rows.forEach(row => {
      const cols = row.split(",");

      const product = {
        id: cols[0]?.trim(),
        name: cols[1]?.trim(),
        price: Number(cols[2]),
        image: cols[3]?.trim()
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
    const el = document.getElementById("products");
    if (el) el.innerHTML = "<p>Lỗi tải sản phẩm</p>";
  });
