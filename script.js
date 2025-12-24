document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products");
  if (!container) return;

  fetch(CSV_URL)
    .then(res => res.text())
    .then(text => {
      const rows = text.split("\n").slice(1);
      window.ALL_PRODUCTS = [];
      container.innerHTML = "";

      rows.forEach((row, index) => {
        if (!row.trim()) return;

        const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        if (!cols || cols.length < 2) {
          console.warn("Dòng lỗi:", index + 2, row);
          return;
        }

        const clean = v =>
          v ? v.replace(/^"|"$|\\r/g, "").trim() : "";

        const id = clean(cols[0]) || `auto-${index}`;
        const name = clean(cols[1]);
        const priceRaw = clean(cols[2]);
        const image = clean(cols[3]) || NO_IMAGE;

        // ✅ FIX GIÁ
        const price = Number(priceRaw.replace(/[^\d]/g, "") || 0);

        if (!name) {
          console.warn("Thiếu tên:", index + 2);
          return;
        }

        const product = { id, name, price, image };
        window.ALL_PRODUCTS.push(product);

        container.innerHTML += `
          <div class="product">
            <img src="${encodeURI(image)}"
              onclick="viewDetail('${id}')">
            <h3 onclick="viewDetail('${id}')">${name}</h3>
            <div class="price">
              ${price.toLocaleString("vi-VN")} ₫
            </div>
            <button class="buy-btn"
              onclick="addToCartById('${id}')">
              Thêm vào giỏ
            </button>
          </div>
        `;
      });

      console.log("LOAD ĐƯỢC:", window.ALL_PRODUCTS.length);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Lỗi tải sản phẩm</p>";
    });
});
