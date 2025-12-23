const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFH4wYQLPAfCV2-5AmnGniVcyQ6LqlSHxUEkBa8Vc8O3s-OvBWTT0ZHQqTKirZN3yV4Rzd3a_QPqMj/pub?output=csv";

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
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

// LOAD SẢN PHẨM
fetch(CSV_URL)
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split("\n").slice(1);
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";

    rows.forEach(row => {
      const cols = row.split(",");
      const product = {
        id: cols[0],
        name: cols[1],
        price: Number(cols[2]),
        image: cols[3]
      };

      if (!product.name || !product.price || !product.image) return;

      container.innerHTML += `
        <div class="product">
          <img src="${encodeURI(product.image)}">
          <h3>${product.name}</h3>
          <div class="price">${product.price.toLocaleString("vi-VN")} ₫</div>

          <button class="buy-btn"
            onclick='addToCart(${JSON.stringify(product)})'>
            Thêm vào giỏ
          </button>
        </div>
      `;
    });
  });
  .catch(() => {
    document.getElementById("products").innerHTML =
      "<p>Lỗi tải sản phẩm</p>";
  });
