// ================== CONFIG ==================
const sheetId = "1U7aPpLyUdDa1u1MOhX7i1nq4N-8UzvrlnGjLM6wI9hY";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
// ============================================

// Load danh sách sản phẩm từ Google Sheet
fetch(url)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";

    rows.forEach((r, index) => {
      // ⚠️ Cột theo Sheet của bạn
      const ten = r.c[1]?.v || "";
      let gia = r.c[2]?.v || 0;
      const anh = r.c[3]?.v || "";

      // ✅ Ép giá về số (xoá dấu . , ₫ ...)
      gia = Number(String(gia).replace(/[^\d]/g, ""));

      // Bỏ qua dòng không hợp lệ
      if (!ten || !gia || !anh) return;

      const product = {
        id: index + 1,   // ID số, ổn định
        name: ten,
        price: gia,
        image: anh
      };

      container.innerHTML += `
        <div class="product">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <div class="price">${product.price.toLocaleString()} ₫</div>
          <button onclick='addToCart(${JSON.stringify(product)})'>
            Mua ngay
          </button>
        </div>
      `;
    });
  })
  .catch(err => {
    console.error("❌ Lỗi load sản phẩm:", err);
  });

/* =================================================
   Ghi chú QUAN TRỌNG:
