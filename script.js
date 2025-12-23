function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  const cartEl = document.getElementById("cart");
  const totalEl = document.getElementById("total");
  if (!cartEl) return;

  cartEl.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price * item.qty;

    cartEl.innerHTML += `
      <div>
        <b>${item.name}</b><br>
        ${item.price.toLocaleString("vi-VN")} ₫ x ${item.qty}<br>
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="changeQty(${i},-1)">-</button>
        <button onclick="removeItem(${i})">Xóa</button>
      </div>
      <hr>
    `;
  });

  totalEl.innerText = total.toLocaleString("vi-VN") + " ₫";
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
