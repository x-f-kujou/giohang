/************ CONFIG ************/
const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

/************ CART ************/
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((s, p) => s + p.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = count;
}

/************ ADD TO CART ************/
function addToCart(product) {
  const cart = getCart();
  const found = cart.find(p => p.id === product.id);

  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });

  saveCart(cart);
  alert("Đã thêm vào giỏ hàng");
}

/************ LOAD PRODUCTS ************/
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  const container = document.getElementById("products");
  if (!container) return;

  fetch(CSV_URL)
    .then(r => r.text())
    .then(text => {
      const rows = text.trim().split("\n").slice(1);

      rows.forEach(row => {
        const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (!c[0] || !c[1]) return;

        const product = {
          id: c[0].trim(),
          name: c[1].replace(/"/g,""),
          price: Number(c[2]) || 0,
          image: c[3]?.replace(/"/g,"") || "https://via.placeholder.com/300"
        };

        container.innerHTML += `
          <div class="product">
            <img src="${product.image}">
            <h3>${product.name}</h3>
            <div class="price">${product.price.toLocaleString("vi-VN")} ₫</div>
            <button onclick='addToCart(${JSON.stringify(product)})'>
              Thêm vào giỏ
            </button>
          </div>
        `;
      });
    });
});

/************ CART PAGE ************/
function renderCart() {
  const cart = getCart();
  const box = document.getElementById("cart");
  const totalBox = document.getElementById("total");
  if (!box) return;

  let total = 0;
  box.innerHTML = "";

  cart.forEach(p => {
    total += p.price * p.qty;
    box.innerHTML += `
      <div class="cart-item">
        <b>${p.name}</b><br>
        ${p.price.toLocaleString("vi-VN")} ₫ × ${p.qty}
      </div>
    `;
  });

  totalBox.innerText = total.toLocaleString("vi-VN") + " ₫";
}

document.addEventListener("DOMContentLoaded", renderCart);

/************ ZALO ************/
function sendOrderToZalo() {
  const cart = getCart();
  if (!cart.length) return alert("Giỏ hàng trống");

  let msg = "🛒 ĐƠN HÀNG VNG COSMETICS%0A";
  let total = 0;

  cart.forEach(p => {
    msg += `• ${p.name} x${p.qty}%0A`;
    total += p.price * p.qty;
  });

  msg += `%0A👉 Tổng: ${total.toLocaleString("vi-VN")} ₫`;

  window.open("https://zalo.me/0358256608?text=" + msg);
}

/************ GOOGLE FORM ************/
function submitOrderForm() {
  const cart = getCart();
  let products = "";
  let total = 0;

  cart.forEach(p => {
    products += `${p.name} x${p.qty} | `;
    total += p.price * p.qty;
  });

  const formUrl =
    "https://docs.google.com/forms/d/e/FORM_ID/viewform" +
    "?entry.111111=" + encodeURIComponent(products) +
    "&entry.222222=" + encodeURIComponent(total);

  window.location.href = formUrl;
          }
          
